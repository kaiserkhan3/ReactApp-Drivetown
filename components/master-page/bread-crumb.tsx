"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type BreadCrumbProps = {
  from: string;
  to: string;
  pageTitle: string;
};

type breadcrumbDetails = {
  dashboard: BreadCrumbProps;
  "inventory-management": BreadCrumbProps;
  appoinments: BreadCrumbProps;
  templates: BreadCrumbProps;
  masters: BreadCrumbProps;
  reports: BreadCrumbProps;
  smshistory: BreadCrumbProps;
  dailyexpenses: BreadCrumbProps;
};

const initialState: breadcrumbDetails = {
  dashboard: { from: "Home", to: "Dashboard", pageTitle: "Dashboard" },
  "inventory-management": {
    from: "Home",
    to: "Inventory",
    pageTitle: "Inventory Management",
  },
  appoinments: { from: "Home", to: "Appointments", pageTitle: "Appointments" },
  templates: {
    from: "Home",
    to: "SMS Templates",
    pageTitle: "Manage SMS Templates",
  },
  masters: { from: "Home", to: "Masters", pageTitle: "Admin Tasks" },
  reports: {
    from: "Home",
    to: "sale-report",
    pageTitle: "Reports Data",
  },
  smshistory: {
    from: "Home",
    to: "sms-history",
    pageTitle: "SMS History",
  },
  dailyexpenses: {
    from: "Home",
    to: "daily-expenses",
    pageTitle: "Daily Expenses",
  },
};

export const BreadCrumb = () => {
  const [data, setData] = useState<BreadCrumbProps>();
  const path = usePathname();
  useEffect(() => {
    const pathName = path.split("/")[1];
    setData(initialState[pathName as keyof breadcrumbDetails]);
  }, [path]);
  return (
    <div>
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link href={"/inventory-new"}>{data?.from || "Home"}</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {data?.to}
          </li>
        </ol>
      </nav>
      <h1 className="page-title">{data?.pageTitle}</h1>
    </div>
  );
};
