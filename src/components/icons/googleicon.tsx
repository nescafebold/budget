import Image from "next/image";

export default function GoogleIcon() {
    return (
        <Image
            src="/google.svg"
            alt="Google Logo"
            fill
            className='object-cover'
        />
    );
}