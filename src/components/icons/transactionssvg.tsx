import Image from 'next/image';

export default function TransactionsSvg() {
    return (
        <Image
            src="/transactions.svg"
            alt="Transactions Logo"
            fill
            className='object-cover'
        />
    );
}