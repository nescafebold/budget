import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

// This middleware runs on EVERY request before the page loads.
// Think of it like a security guard at the door.
export default auth((req) => {
    // req.auth contains the session if the user is logged in, or null if not.
    const isLoggedIn = !!req.auth; // !! converts to a boolean (true/false)

    const { pathname } = req.nextUrl;

    // Define which paths are "public" (no login needed)
    const isPublicPath =
        pathname.startsWith("/login") ||
        pathname.startsWith("/register") ||
        pathname.startsWith("/api/auth");

    // If they're NOT logged in and trying to access a private page → redirect to login
    if (!isLoggedIn && !isPublicPath) {
        const loginUrl = new URL("/login", req.url);
        // We add a "callbackUrl" so after login, they go back to the page they wanted
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    // If they ARE logged in and trying to go to /login or /register → redirect to dashboard
    if (isLoggedIn && isPublicPath && !pathname.startsWith("/api/auth")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    // Otherwise, let them through
    return NextResponse.next();
});

// This tells Next.js WHICH routes to run this middleware on.
// We skip static files, images, and Next.js internals — no need to check those.
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};