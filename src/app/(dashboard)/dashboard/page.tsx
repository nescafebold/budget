// This is a Server Component (no "use client") so we can call auth() directly.
// auth() reads the session from the cookie without any extra API calls.
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/logout-button";

export default async function DashboardPage() {
    // Get the current session
    const session = await auth();

    // If no session, kick them to login (middleware handles this too, but double-checking is fine)
    if (!session) redirect("/login");

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold mb-2">
                    Welcome, {session.user.name}! 👋
                </h1>
                <p className="text-muted-foreground">Dashboard coming in week 3.</p>
                <p className="text-sm text-muted-foreground mt-2">
                    Logged in as: {session.user.email}
                </p>
            </div>
            <LogoutButton />
        </div>
    );
}