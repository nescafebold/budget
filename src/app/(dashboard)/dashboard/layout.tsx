import { lato } from "@/components/fonts/fonts";
import SideNav from "@/components/ui/sidenav";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <div className="flex flex-col-reverse max-h-screen md:grid md:grid-cols-12 md:gap-2 md:flex-col">
            <div className="w-full md:col-span-2">
                <SideNav></SideNav>
            </div>
            <div className="w-full h-full md:col-span-10">
                {children}
            </div>
        </div>
    );
}
