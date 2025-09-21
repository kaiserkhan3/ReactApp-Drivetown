import { dashboardTabs } from "@/models/inventory/enum";
import { useState } from "react";
import { StackedBarChartForSales } from "./chart-reports/sales-stacked-bar-chart";

export const TabChartContainer = () => {
  const [activeTab, setActiveTab] = useState<string>(dashboardTabs.purchse);
  return (
    <>
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === dashboardTabs.purchse ? "active" : ""}`}
            aria-current="page"
            href="#"
            onClick={() => setActiveTab(dashboardTabs.purchse)}
          >
            {dashboardTabs.purchse}
          </a>
        </li>
        <li className="nav-item">
          <a
            className={`nav-link ${activeTab === dashboardTabs.sales ? "active" : ""}`}
            aria-current="page"
            href="#"
            onClick={() => setActiveTab(dashboardTabs.sales)}
          >
            {dashboardTabs.sales}
          </a>
        </li>
      </ul>

      {activeTab === dashboardTabs.sales && <StackedBarChartForSales />}
    </>
  );
};
