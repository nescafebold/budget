import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransactionPage() {
    // Get the current session
    const session = await auth();

    // If no session, kick them to login (middleware handles this too, but double-checking is fine)
    if (!session) redirect("/login");

    return (
        <div className="min-h-screen flex items-center justify-center">Hello from debt-tracker</div>
    )
}