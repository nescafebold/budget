import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.AUTH_SECRET!);

export async function createAccessToken(userId: string) {
    return new SignJWT({ sub: userId }) // "sub" = subject = who this token is for
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("15m")
        .sign(secret);
}

export async function createRefreshToken(userId: string) {
    return new SignJWT({ sub: userId })
        .setProtectedHeader({ alg: "HS256" })
        .setIssuedAt()
        .setExpirationTime("7d") // expires in 7 days
        .sign(secret);
}

export async function verifyToken(token: string) {
    try {
        const { payload } = await jwtVerify(token, secret);
        return payload;
    } catch {
        return null;
    }
}

export function refreshTokenExpiry(): Date {
    const date = new Date();
    date.setDate(date.getDate() + 7); // add 7 days to right now
    return date;
}