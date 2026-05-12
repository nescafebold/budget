import Logo from "@/components/ui/logo"
import NavLinks from "@/components/ui/nav-links";
import SideNavLinks from "./side-nav-links";

export default function SideNav() {
    return (
        <div className="w-full h-15 border flex flex-row md:flex-col md:h-full md:rounded-2xl md:mx-2 md:cols-span-2 bg-[#FFFFF5]">
            <Logo />
            <div>
                <hr className="hidden md:block md:border-t-2 md:w-[90%] md:mx-auto md:mb-5" />
            </div>
            <SideNavLinks />
        </div>
    );
}
