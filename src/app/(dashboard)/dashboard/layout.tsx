import { lato } from "@/components/fonts/fonts";
import SideNav from "@/components/ui/sidenav";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="flex flex-col-reverse h-screen overflow-hidden md:grid md:grid-cols-8 md:gap-1 md:flex-col lg:grid lg:grid-cols-12 lg:gap-2 lg:flex-col">
            <div className="w-full md:col-span-1 lg:col-span-2">
                <SideNav></SideNav>
            </div>
            <div className="w-full h-full md:col-span-7 lg:col-span-10 overflow-y-auto">
                {children}
            </div>
        </div>
    );
}
