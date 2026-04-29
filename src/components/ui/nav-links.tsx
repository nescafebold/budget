import MenuSvg from "@/components/icons/menusvg";
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import clsx from "clsx";
import Link from "next/link";

const links = [
    {
        name: "Home",
        href: "/",
    },
    {
        name: "Features",
        href: "#features",
    },
    {
        name: "Screenshots",
        href: "#screenshots",
    },
    {
        name: "Help Center",
        href: "#help-center",
    },
];



export default function NavLinks() {
    return (
        <div className="my-auto mx-2 ">
            <div className="block md:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="cursor-pointer" size="xl">
                            <div className="flex justify-center items-center">
                                <MenuSvg className="size-7" />
                            </div>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuGroup>
                            {links.map((link) => {
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                    >
                                        <div>
                                            < DropdownMenuItem > {link.name}</DropdownMenuItem>
                                        </div>

                                    </Link>
                                )
                            })}

                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className=" hidden md:flex md:justify-around md:flex-row md:gap-6 text-[#013E34]">
                {links.map((link) => {
                    return (
                        <Link className="hover:text:lg px-4"
                            key={link.name}
                            href={link.href}
                        >  <p > {link.name} </p></Link>
                    )
                })}
            </div>
        </div >
    )
}