import Image from 'next/image';

export default function DashboardSvg() {
  return (
    <Image
      src="/dashboard.svg"
      alt="Dashboard Logo"
      fill
      className='object-cover'
    />
  );
}