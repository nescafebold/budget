import Image from "next/image";

export default function GithubIcon() {
    return (
        <Image
            src="/github.svg"
            alt="Github Logo"
            fill
            className='object-cover'
        />
    );
}