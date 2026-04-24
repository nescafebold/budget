import { NextRequest, NextResponse } from "next/server";
import { eq, and } from "drizzle-orm";
import { db } from "@/db";
import { refreshTokens } from "@/db/schema";
import { verifyToken, createAccessToken, createRefreshToken, refreshTokenExpiry } from "@/lib/tokens";

export async function POST(req: NextRequest) {
    try {
        const { token } = await req.json();

        if (!token) {
            return NextResponse.json({ error: "No token provided" }, { status: 401 });
        }

        // ---------- VERIFY THE TOKEN IS LEGITIMATE ----------
        const payload = await verifyToken(token);
        if (!payload || !payload.sub) {
            return NextResponse.json({ error: "Invalid token" }, { status: 401 });
        }

        // ---------- CHECK TOKEN EXISTS IN DB AND ISN'T REVOKED ----------
        // We use "and()" to combine two conditions — like WHERE a = ? AND b = ?
        const storedToken = await db.query.refreshTokens.findFirst({
            where: and(
                eq(refreshTokens.token, token),
                eq(refreshTokens.isRevoked, false) // must not be revoked
            ),
        });

        if (!storedToken) {
            return NextResponse.json({ error: "Token not found or revoked" }, { status: 401 });
        }

        // ---------- CHECK IT HASN'T EXPIRED ----------
        if (storedToken.expiresAt < new Date()) {
            return NextResponse.json({ error: "Token expired" }, { status: 401 });
        }

        // ---------- ROTATE TOKENS (revoke old, issue new) ----------
        // Mark the old refresh token as revoked
        await db
            .update(refreshTokens)
            .set({ isRevoked: true })
            .where(eq(refreshTokens.token, token));

        // Create brand new tokens
        const newAccessToken = await createAccessToken(payload.sub);
        const newRefreshToken = await createRefreshToken(payload.sub);

        // Store the new refresh token
        await db.insert(refreshTokens).values({
            userId: payload.sub,
            token: newRefreshToken,
            expiresAt: refreshTokenExpiry(),
        });

        return NextResponse.json({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error("Refresh error:", error);
        return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
    }
}