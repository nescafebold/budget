import { cedarville } from "@/components/fonts/fonts";

export default function Logo() {
    return (
        <div
            className={`${cedarville.className} antialiased hidden md:block md:px-4 md:py-2 md:flex md:flex-row md:w-full md:justify-center`}
        >
            <span className=" text-5xl font-bold ">B</span>
            <span className="text-lg hidden lg:block">udgefy</span>
        </div>
    )
}