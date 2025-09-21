"use client";

import { PageHeaderCommon } from "../master-page/page-header";
import { DashboardCard } from "./dashboard-card";
import { PieSalesBySaleType } from "./chart-reports/salesByTypeOfSale";
import { SalesOverviewChart } from "./chart-reports/SalesOverviewChart";
import { ChangeEvent, useState } from "react";
import { getCurrentYear } from "@/utilities";
import { ProfitWithMargin } from "./chart-reports/profit-with-margin";
import { ExpensePieChart } from "./chart-reports/expense-pie-chart";
import { TodoContainer } from "./todo/todo-container";

export const DashboardContainer = () => {
  const [saleType, setSaleType] = useState<string>("All");
  const [year, setYear] = useState<number>(getCurrentYear());

  const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    if (value.length === 4) {
      setYear(parseInt(value));
    } else if (value.length === 0) {
      setYear(getCurrentYear());
    }
  };

  return (
    <>
      <div>
        <DashboardCard />

        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">{year} Sales Overview</h5>
                <div className="card-actions">
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      maxHeight: "60px",
                    }}
                  >
                    <input
                      type="number"
                      name="year"
                      style={{ width: "10rem", borderRadius: "5px" }}
                      title="Enter the year to view sales overview"
                      placeholder="Enter the year to view sales overview"
                      onChange={inputChangeHandler}
                    />
                  </div>
                  <div
                    className="btn-group btn-group-sm"
                    style={{ maxHeight: "60px" }}
                  >
                    <button
                      type="button"
                      className={`btn btn-outline-secondary ${saleType === "All" ? "active" : ""}`}
                      onClick={() => setSaleType("All")}
                    >
                      All Sales
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-secondary ${saleType === "Cash" ? "active" : ""}`}
                      onClick={() => setSaleType("Cash")}
                    >
                      Cash Only
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-secondary ${saleType === "Finance" ? "active" : ""}`}
                      onClick={() => setSaleType("Finance")}
                    >
                      Finance
                    </button>
                    <button
                      type="button"
                      className={`btn btn-outline-secondary ${saleType === "Wholesale" ? "active" : ""}`}
                      onClick={() => setSaleType("Wholesale")}
                    >
                      Wholesale
                    </button>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      id="exportSalesDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="exportSalesDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-csv"></i> Export CSV
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-json"></i> Export JSON
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <SalesOverviewChart filter={saleType} year={year} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Sales by Type</h5>
                <div className="card-actions">
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      id="salesTypeDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="salesTypeDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-csv"></i> Export CSV
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-json"></i> Export JSON
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <PieSalesBySaleType />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-8 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Profit Margin</h5>
                <div className="card-actions">
                  <div className="btn-group btn-group-sm">
                    <button
                      type="button"
                      className="btn btn-outline-secondary active"
                    >
                      Last 3 Months
                    </button>
                    <button type="button" className="btn btn-outline-secondary">
                      Last 6 Months
                    </button>
                    <button type="button" className="btn btn-outline-secondary">
                      Full Year
                    </button>
                  </div>
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      id="exportProfitDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="exportProfitDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-csv"></i> Export CSV
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-json"></i> Export JSON
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <ProfitWithMargin year={year} />
              </div>
            </div>
          </div>

          <div className="col-lg-4 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Expenses</h5>
                <div className="card-actions">
                  <div className="dropdown">
                    <button
                      className="btn btn-sm btn-outline-secondary dropdown-toggle"
                      type="button"
                      id="exportExpensesDropdown"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-download"></i>
                    </button>
                    <ul
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="exportExpensesDropdown"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-csv"></i> Export CSV
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          <i className="bi bi-filetype-json"></i> Export JSON
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <ExpensePieChart />
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-lg-6 mb-4">
            <TodoContainer />
          </div>

          <div className="col-lg-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5 className="card-title">Recent Activity</h5>
              </div>
              <div className="card-body p-0">
                <ul className="activity-list">
                  <li className="activity-item">
                    <div className="activity-icon sale">
                      <i className="bi bi-cash"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">New Sale Completed</div>
                      <div className="activity-details">
                        2019 BMW 3 Series sold to Sarah Johnson
                      </div>
                      <div className="activity-time">Today, 11:23 AM</div>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon appointment">
                      <i className="bi bi-calendar-check"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">
                        New Appointment Scheduled
                      </div>
                      <div className="activity-details">
                        Test drive with Michael Brown for Mercedes C-className
                      </div>
                      <div className="activity-time">Today, 10:15 AM</div>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon inventory">
                      <i className="bi bi-car-front"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">
                        New Vehicle Added to Inventory
                      </div>
                      <div className="activity-details">
                        2022 Toyota Camry Hybrid added by Robert
                      </div>
                      <div className="activity-time">Yesterday, 3:45 PM</div>
                    </div>
                  </li>
                  <li className="activity-item">
                    <div className="activity-icon service">
                      <i className="bi bi-tools"></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-title">Service Completed</div>
                      <div className="activity-details">
                        Oil change and inspection for Honda Accord
                      </div>
                      <div className="activity-time">Yesterday, 2:30 PM</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
