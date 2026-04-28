import Image from 'next/image';

export default function DebtTrackerSvg() {
    return (
        <Image
            src="/debt-tracker.svg"
            alt="Debt Tracker Logo"
            fill
            className='object-cover'
        />
    );
}