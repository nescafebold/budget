import Image from 'next/image';

export default function SettingsSvg() {
    return (
        <Image
            src="/settings.svg"
            alt="Settings Logo"
            fill
            className='object-cover'
        />
    );
}