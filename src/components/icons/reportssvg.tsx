import Image from 'next/image';

export default function ReportsSvg() {
    return (
        <Image
            src="/reports.svg"
            alt="Reports Logo"
            fill
            className='object-cover'
        />
    );
}