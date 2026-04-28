import Logo from "@/components/ui/logo";
import NavLinks from "@/components/ui/nav-links";

export default function NavBar() {
    return (
        <nav className="flex flex-row w-full h-20 border-b border-[#013E34] justify-between bg-[#FFFFF5] px-4 ">
            <Logo />
            <NavLinks />

        </nav>
    )

}