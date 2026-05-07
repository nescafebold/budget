import { Cedarville_Cursive } from "next/font/google"

const cedarville = Cedarville_Cursive({
    variable: "--font-lato",
    weight: ["400"],
    subsets: ["latin"]
})

export default function Logo() {
    return (
        <div
            className={`${cedarville.className} antialiased flex flex-row my-auto text-[#013E34]`}
        >
            <span className=" text-5xl font-bold ">B</span>
            <span className="text-lg hidden lg:block">udgefy</span>
        </div>
    )
}