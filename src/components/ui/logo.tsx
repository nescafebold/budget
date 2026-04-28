import { Cedarville_Cursive } from "next/font/google"

const cedarville = Cedarville_Cursive({
    variable: "--font-lato",
    weight: ["400"],
    subsets: ["latin"]
})

export default function Logo() {
    return (
        <div
            className={`${cedarville.variable} antialiased flex flex-row pt-3  justify-center text-[#013E34] p-4`}
        >
            <span className=" text-5xl font-bold">B</span>
            <span className="text-lg hidden lg:block">udgefy</span>
        </div>
    )
}