'use client'
import { usePathname } from 'next/navigation'
import NavBar from "@/components/ui/navbar"

export default function ConditionalNavBar() {
    const pathname = usePathname()
    if (pathname === '/' || pathname === "/login" || pathname === "/signup") return <NavBar />
    return null
}