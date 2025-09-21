"use client";
import { useStoreSelector } from "@/app/store/hook";
import { DashboardHeaderCard } from "./dashboard-header-card";

export const DashboardCard = () => {
  const data = useStoreSelector((state) => state.commonData);
  return (
    <>
      <div className="row">
        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.availableVehiclesCount}
            label="Showroom"
            icon={<i className="bi bi-shop"></i>}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.appoinmentsCount}
            label="Appointments"
            icon={<i className="bi bi-calendar-check"></i>}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.repairShopCount}
            label="Repair Shop"
            icon={<i className="bi bi-tools"></i>}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.wholesaleCount}
            label="Whole Sale"
            icon={<i className="bi bi-truck"></i>}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.inspectionCount}
            label="Inspection"
            icon={<i className="bi bi-clipboard-check"></i>}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.registerationCount}
            label="Pending Registration"
            icon={<i className="bi bi-dash"></i>}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.onlineCount}
            label="Online"
            icon={<i className="bi bi-globe"></i>}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={"$ " + data.monthlyProfit}
            label="Monthly Profit"
            icon={<i className="bi bi-cash-coin"></i>}
          />
        </div>
      </div>
      {/* <div className="row">
        <div className="col-lg-8 mb-4">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Sales Overview</h5>
              <div className="card-actions">
                <div className="btn-group btn-group-sm">
                  <button
                    type="button"
                    className="btn btn-outline-secondary active"
                  >
                    All Sales
                  </button>
                  <button type="button" className="btn btn-outline-secondary">
                    Cash Only
                  </button>
                  <button type="button" className="btn btn-outline-secondary">
                    Finance
                  </button>
                  <button type="button" className="btn btn-outline-secondary">
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
              <canvas
                id="salesChart"
                height="300"
                width="562"
                style={{
                  display: "block",
                  boxSizing: "border-box",
                  height: "300px",
                  width: "562px",
                }}
              ></canvas>
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
              <canvas
                id="salesTypeChart"
                height="300"
                width="240"
                style={{
                  display: "block",
                  boxSizing: "border-box",
                  height: "300px",
                  width: "240px",
                }}
              ></canvas>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
};
