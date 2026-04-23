// NextRequest = the incoming HTTP request object
// NextResponse = what we send back to the client
import { NextRequest, NextResponse } from "next/server";

// eq is a Drizzle helper that means "equals" in SQL — like WHERE email = '...'
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { registerSchema } from "@/lib/validations";
import { registerRateLimit } from "@/lib/rate-limit";
import bcrypt from "bcryptjs";

// In Next.js App Router, you export a function named after the HTTP method.
// POST = this function handles POST requests to /api/auth/register
export async function POST(req: NextRequest) {
    try {
        // ---------- RATE LIMIT CHECK ----------
        // Get the user's IP address from the request headers.
        // "x-forwarded-for" is a standard header that contains the real IP
        // when the request goes through a proxy (like Vercel's servers).
        const ip = req.headers.get("x-forwarded-for") ?? "anonymous";

        // Check if this IP has exceeded the limit.
        // success = true means they're allowed, false means they're blocked.
        const { success } = await registerRateLimit.limit(ip);

        if (!success) {
            // 429 = "Too Many Requests" — a standard HTTP status code
            return NextResponse.json(
                { error: "Too many attempts. Please try again later." },
                { status: 429 }
            );
        }

        // ---------- PARSE REQUEST BODY ----------
        // req.json() reads the JSON data sent in the request body.
        // This is the data from your register form (name, email, password).
        const body = await req.json();

        // safeParse checks the data against our schema.
        // Unlike parse(), safeParse doesn't throw — it returns success or error.
        const result = registerSchema.safeParse(body);

        if (!result.success) {
            // result.error.flatten() converts Zod errors into a simple object
            // like: { fieldErrors: { email: ["Invalid email"] } }
            return NextResponse.json(
                { error: result.error.flatten().fieldErrors },
                { status: 400 } // 400 = "Bad Request"
            );
        }

        // If we get here, the data is valid. Destructure it.
        const { name, email, password } = result.data;

        // ---------- CHECK IF EMAIL EXISTS ----------
        // db.query.users.findFirst() = SELECT * FROM users WHERE email = ? LIMIT 1
        const existingUser = await db.query.users.findFirst({
            where: eq(users.email, email),
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "An account with this email already exists." },
                { status: 409 } // 409 = "Conflict"
            );
        }

        // ---------- HASH THE PASSWORD ----------
        // NEVER store plain text passwords. bcrypt scrambles the password.
        // The number 12 is the "salt rounds" — how many times it scrambles.
        // Higher = more secure but slower. 12 is the industry standard.
        // Even if someone steals your database, they can't reverse bcrypt easily.
        const passwordHash = await bcrypt.hash(password, 12);

        // ---------- CREATE THE USER ----------
        // db.insert() = INSERT INTO users (...) VALUES (...)
        // .values() = the data to insert
        // .returning() = return the inserted row (so we get the auto-generated id)
        const [newUser] = await db
            .insert(users)
            .values({
                name,
                email,
                passwordHash,
                provider: "credentials",
            })
            .returning({ id: users.id, name: users.name, email: users.email });

        // 201 = "Created" — standard response for successful resource creation
        return NextResponse.json(
            { message: "Account created successfully!", user: newUser },
            { status: 201 }
        );
    } catch (error) {
        // If anything unexpected goes wrong, catch it here.
        // Never expose the real error to the client — it might contain sensitive info.
        console.error("Register error:", error);
        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 } // 500 = "Internal Server Error"
        );
    }
}