import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function TransactionPage() {
    // Get the current session
    const session = await auth();

    // If no session, kick them to login (middleware handles this too, but double-checking is fine)
    if (!session) redirect("/login");

    return (
        <div>Hello from transactions</div>
    )
}