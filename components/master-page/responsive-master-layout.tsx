"use client";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { getCommonData } from "@/app/store/master-data-slice";
import { useUserData } from "@/hooks/useUserData";
import drivetownLogo from "@/public/drivetown.webp";
import { checkLoginValid } from "@/utilities/check-login-valid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import { SendSmsButton } from "./send-sms-button";
import "./responsive-master-layout.css";

type MasterLayoutProps = {
  children: React.ReactNode;
};

export const ResponsiveMasterLayout = ({ children }: MasterLayoutProps) => {
  const router = useRouter();
  const path = usePathname();
  const { userName, role } = useUserData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isMobileOrTablet = useMediaQuery({ maxWidth: 1024 });

  const dispatch = useStoreDispatch();
  const commonData = useStoreSelector((state) => state.commonData);

  useEffect(() => {
    dispatch(getCommonData());
    // mark as mounted so client-only values (localStorage, store updates) render only on client
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!checkLoginValid()) {
      router.push("/");
    }
  }, []);

  return (
    <>
      <div
        className={isSidebarOpen ? "sidebar collapsed" : "sidebar"}
        id="sidebar"
      >
        <div
          className="sidebar-header"
          style={{
            backgroundImage: `url(${drivetownLogo.src})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
            width: "17rem",
            height: "2rem",
            marginBottom: "1rem",
            margin: "1rem",
          }}
        >
          <button
            className="sidebar-toggle"
            id="sidebar-toggle"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
        </div>

        <div className="nav-section">
          <div
            className="nav-section-title"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <span>Main</span>
            <SendSmsButton />
          </div>
          <Link
            href="/dashboard"
            className={path === "/dashboard" ? "nav-item active" : "nav-item"}
            data-page="dashboard"
          >
            <i className="bi bi-speedometer2"></i>
            <span>Dashboard</span>
          </Link>
          <Link
            href="/inventory-management"
            className={
              path === "/inventory-management" ? "nav-item active" : "nav-item"
            }
            data-page="inventory"
          >
            <i className="bi bi-car-front"></i>
            <span>Inventory</span>
            {mounted && (
              <span className="badge rounded-pill">
                {commonData?.availableVehiclesCount}
              </span>
            )}
          </Link>
          <Link
            href="/appoinments"
            className={path === "/appoinments" ? "nav-item active" : "nav-item"}
            data-page="appointments"
          >
            <i className="bi bi-calendar-check"></i>
            <span>Appointments</span>
            {mounted && (
              <span className="badge rounded-pill">
                {commonData?.appoinmentsCount}
              </span>
            )}
          </Link>
          <Link href="/dailyexpenses" className="nav-item">
            <i className="bi bi-check2-square"></i>
            <span>Daily Expenses</span>
          </Link>
        </div>

        {/* <div className="nav-section">
          <div className="nav-section-title">Sales</div>
          <a href="#" className="nav-item">
            <i className="bi bi-cart"></i>
            <span>Test Drive</span>
          </a>
          <a href="#" className="nav-item">
            <i className="bi bi-cash-coin"></i>
            <span>Financing</span>
          </a>
          <a href="#" className="nav-item">
            <i className="bi bi-file-earmark-text"></i>
            <span>Contracts</span>
          </a>
        </div> */}

        <div className="nav-section">
          <div className="nav-section-title">Communication</div>
          <Link href="/templates" className="nav-item">
            <i className="bi bi-chat-left-text"></i>
            <span>SMS Templates</span>
          </Link>
          <Link href="/smshistory" className="nav-item">
            <i className="bi bi-clock-history"></i>
            <span>SMS History</span>
          </Link>

          {/* <a href="#" className="nav-item">
            <i className="bi bi-telephone"></i>
            <span>Call Log</span>
          </a>
          <a href="#" className="nav-item">
            <i className="bi bi-people"></i>
            <span>Customers</span>
          </a> */}
        </div>
        {mounted && role === "Admin" && (
          <div className="nav-section">
            <div className="nav-section-title">Administration</div>
            <Link href="/masters" className="nav-item">
              <i className="bi bi-gear"></i>
              <span>Masters</span>
            </Link>
            {/* <a href="#" className="nav-item">
            <i className="bi bi-bank"></i>
            <span>Bank Info</span>
          </a> */}
            <Link href="/reports" className="nav-item">
              <i className="bi bi-graph-up"></i>
              <span>Reports</span>
            </Link>
            {/* <a href="#" className="nav-item">
            <i className="bi bi-sliders"></i>
            <span>Settings</span>
          </a> */}
          </div>
        )}

        <div className="sidebar-footer">
          {mounted ? (
            <div className="user-info">
              <div className="user-avatar">M</div>
              <div className="user-details">
                <div className="user-name">{userName}</div>
                <div className="user-role">{role}</div>
              </div>
            </div>
          ) : (
            // placeholder to keep DOM shape consistent on server
            <div className="user-info" aria-hidden>
              <div className="user-avatar">&nbsp;</div>
              <div className="user-details">
                <div className="user-name">&nbsp;</div>
                <div className="user-role">&nbsp;</div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div
        className={isSidebarOpen ? "main-content expanded" : "main-content"}
        id="main-content"
      >
        {children}
      </div>
    </>
  );
};
