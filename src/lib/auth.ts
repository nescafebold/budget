import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import { users, refreshTokens } from "@/lib/db/schema";
import { loginSchema } from "@/lib/validations";
import { loginRateLimit } from "@/lib/rate-limit";
import { createAccessToken, createRefreshToken, refreshTokenExpiry } from "@/lib/tokens";
import bcrypt from "bcryptjs";
import { headers } from "next/headers";

export const { handlers, auth, signIn, signOut } = NextAuth({
    // These are the login methods we support
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID!,
            clientSecret: process.env.AUTH_GOOGLE_SECRET!,
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
        }),

        // Credentials = email + password login
        Credentials({
            async authorize(credentials) {
                // ---------- RATE LIMIT ----------
                const headersList = await headers();
                const ip = headersList.get("x-forwarded-for") ?? "anonymous";
                const { success } = await loginRateLimit.limit(ip);

                if (!success) {
                    // Throwing an error here causes next-auth to reject the login
                    throw new Error("TOO_MANY_ATTEMPTS");
                }

                // ---------- VALIDATE INPUT ----------
                const result = loginSchema.safeParse(credentials);
                if (!result.success) throw new Error("INVALID_CREDENTIALS");

                const { email, password } = result.data;

                // ---------- FIND USER ----------
                const user = await db.query.users.findFirst({
                    where: eq(users.email, email),
                });

                // We check both "no user found" and "wrong password" with the same error message.
                // This is intentional — telling hackers "email not found" helps them too much.
                if (!user || !user.passwordHash) throw new Error("INVALID_CREDENTIALS");

                // ---------- VERIFY PASSWORD ----------
                // bcrypt.compare() hashes the incoming password and compares it to the stored hash.
                // It returns true if they match, false if not.
                const isValid = await bcrypt.compare(password, user.passwordHash);
                if (!isValid) throw new Error("INVALID_CREDENTIALS");

                // If we get here, login is successful. Return the user object.
                // next-auth will put this into the token/session.
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            },
        }),
    ],

    // Callbacks run at specific points during the auth flow.
    callbacks: {
        // The "signIn" callback runs after a user successfully authenticates
        // with Google or GitHub — we use it to auto-create their account in our DB.
        async signIn({ user, account }) {
            // If it's email+password, we already handled it in authorize() above
            if (account?.provider === "credentials") return true;

            // For OAuth (Google, GitHub), create the user in our DB if they don't exist yet
            if (!user.email) return false;

            const existing = await db.query.users.findFirst({
                where: eq(users.email, user.email),
            });

            if (!existing) {
                await db.insert(users).values({
                    name: user.name ?? "Unknown",
                    email: user.email,
                    provider: account?.provider as "google" | "github",
                    emailVerified: true, // OAuth emails are already verified
                });
            }

            return true;
        },

        // The "jwt" callback runs when a token is created or updated.
        // Whatever you return here gets saved in the cookie as the session token.
        async jwt({ token, user }) {
            // "user" only exists on the FIRST sign in, not on subsequent requests.
            // So we check: if user exists, this is a fresh login.
            if (user) {
                // Fetch the full user from our DB to get our own UUID
                const dbUser = await db.query.users.findFirst({
                    where: eq(users.email, user.email!),
                });

                if (dbUser) {
                    // Store our custom IDs in the token
                    token.userId = dbUser.id;

                    // Create our access + refresh tokens
                    const accessToken = await createAccessToken(dbUser.id);
                    const refreshToken = await createRefreshToken(dbUser.id);

                    // Save the refresh token to the database
                    await db.insert(refreshTokens).values({
                        userId: dbUser.id,
                        token: refreshToken,
                        expiresAt: refreshTokenExpiry(),
                    });

                    token.accessToken = accessToken;
                    token.refreshToken = refreshToken;

                    // Record when the access token expires (15 min from now, in milliseconds)
                    token.accessTokenExpires = Date.now() + 15 * 60 * 1000;
                }
            }

            // If the access token hasn't expired yet, just return the token as-is
            if (Date.now() < (token.accessTokenExpires as number)) {
                return token;
            }

            // If we get here, the access token has expired — we need to refresh it.
            // Return the token with a flag so the session callback knows it's expired.
            return { ...token, error: "AccessTokenExpired" };
        },

        // The "session" callback controls what data is available in useSession()
        // on the client side. Only put what the frontend NEEDS here.
        async session({ session, token }) {
            session.user.id = token.userId as string;
            session.accessToken = token.accessToken as string;
            session.error = token.error as string | undefined;
            return session;
        },
    },

    // Use JWT strategy — the session is stored in a cookie, not in the database.
    // This is more scalable (no DB hit on every request to check sessions).
    session: { strategy: "jwt" },

    // Custom pages — instead of next-auth's built-in ugly pages, use ours
    pages: {
        signIn: "/login",
        error: "/login",
    },
});