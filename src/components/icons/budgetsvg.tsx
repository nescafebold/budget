import Image from 'next/image';

export default function BudgetSvg() {
    return (
        <Image
            src="/budget.svg"
            alt="Budget Logo"
            fill
            className='object-cover'
        />
    );
}