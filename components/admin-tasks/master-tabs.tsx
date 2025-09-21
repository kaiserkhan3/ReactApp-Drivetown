"use client";
import { masterPageTabs } from "@/models/inventory/enum";
import Link from "next/link";
import { useState } from "react";

type MasterTabProps = {
  children: React.ReactNode[];
};

export const MasterTabs = ({ children }: MasterTabProps) => {
  const [activeTab, setActiveTab] = useState<number>(6);

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
            {masterPageTabs.users}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 1 ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(1)}
          >
            {masterPageTabs.buyer}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 2 ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(2)}
          >
            {masterPageTabs.contractors}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 3 ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(3)}
          >
            {masterPageTabs.announcement}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 4 ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(4)}
          >
            {masterPageTabs.purchers}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 5 ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(5)}
          >
            {masterPageTabs.soldBy}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === 6 ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(6)}
          >
            {masterPageTabs.expenses}
          </Link>
        </li>
      </ul>
      <div>{children[activeTab]}</div>
    </>
  );
};
