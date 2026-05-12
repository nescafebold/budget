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
              "flex h-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:h-12 md:flex-none md:justify-start md:p-2 md:px-3",
              {
                "bg-sky-100 text-blue-600": pathname === link.href,
              },
            )}
          >
            <div className="w-8 h-8 relative">
              <LinkIcon />
            </div>

            <p className="hidden md:block">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
