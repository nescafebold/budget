import Image from 'next/image';

export default function MenuSvg() {
    return (
        <Image
            src="/menu.svg"
            alt="Menu Logo"
            fill
            className='object-cover'
        />
    );
}