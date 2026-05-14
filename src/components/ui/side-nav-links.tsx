"use client";

import DashboardSvg from "@/components/icons/dashboardsvg";
import TransactionsSvg from "@/components/icons/transactionssvg";
import BudgetSvg from "@/components/icons/budgetsvg";
import DebtTrackerSvg from "@/components/icons/debt-trackersvg";
import ReportsSvg from "@/components/icons/reportssvg";
import SettingsSvg from "@/components/icons/settingssvg";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: DashboardSvg,
  },
  {
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: TransactionsSvg,
  },
  {
    name: "Budget",
    href: "/dashboard/budgets",
    icon: BudgetSvg,
  },
  {
    name: "Debt-tracker",
    href: "/dashboard/debt-tracker",
    icon: DebtTrackerSvg,
  },
  {
    name: "Reports",
    href: "/dashboard/reports",
    icon: ReportsSvg,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: SettingsSvg,
  },
];
export default function SideNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        const LinkIcon = link.icon;
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "flex h-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:h-20 md:flex-none md:justify-center md:px-2 lg:h-15 lg:justify-start lg:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              },
            )}
          >
            <div className="md:flex md:flex-col md:items-center md:justify-center md:p-2 lg:flex-row lg:gap-2">
              <LinkIcon className="h-10 w-10 md:h-8 md:w-8 lg:h-10 lg:w-10" />
              <p className="hidden md:block md:text-sm lg:text-md">{link.name}</p>
            </div>
          </Link>
        );
      })}
    </>
  );
}
