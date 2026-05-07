import Logo from "@/components/ui/logo";
import NavLinks from "@/components/ui/nav-links";
import Link from "next/link";

export default function NavBar() {
    return (
        <nav className="flex flex-row w-full h-18 border-b border-[#013E34] justify-between bg-[#FFFFF5] px-4 ">
            <Link href="/" className="flex align-center">
                <Logo />
            </Link>

            <NavLinks />

        </nav >
    )

}