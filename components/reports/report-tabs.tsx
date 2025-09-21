"use client";
import Link from "next/link";
import { useState } from "react";

type ReportTabsProps = {
  children: React.ReactNode[];
};

export const ReportTabs = ({ children }: ReportTabsProps) => {
  const [activeTab, setActiveTab] = useState<number>(0);

  return (
    <>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 0 ? "active" : ""}`}
            aria-current="page"
            href="#"
            onClick={() => setActiveTab(0)}
          >
            Sales
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 1 ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(1)}
          >
            Purchase
          </Link>
        </li>
      </ul>
      <div>{children[activeTab]}</div>
    </>
  );
};
