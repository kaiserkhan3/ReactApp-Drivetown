"use client";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { DashboardHeaderCard } from "./dashboard-header-card";
import { useState } from "react";
import DialogModal from "../control-components/DialogModal";
import NewInventory from "../inventory-list-components/new-inventory";
import { updateOnlineStatus } from "@/app/store/search-slice";
import { OnlineStatus } from "@/models/inventory";

export const DashboardCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useStoreDispatch();
  const data = useStoreSelector((state) => state.commonData);
  return (
    <>
      {modalVisible && (
        <DialogModal top={"3rem"} width="90vw" height="90vh">
          <div className="p-4">
            <div
              style={{ display: "flex", justifyContent: "end", margin: "10px" }}
            >
              <button
                type="button"
                className="btn btn-sm btn-icon text-danger"
                title="Delete"
                onClick={() => {
                  setModalVisible(false);
                }}
              >
                <i className="bi bi-x-octagon" style={{ fontSize: "24px" }}></i>
              </button>
            </div>
            <NewInventory />
          </div>
        </DialogModal>
      )}
      <div className="row">
        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.availableVehiclesCount}
            label="Showroom"
            icon={<i className="bi bi-shop"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.All));
            }}
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
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.RepairShop));
            }}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.wholesaleCount}
            label="Whole Sale"
            icon={<i className="bi bi-truck"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.WholeSale));
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.inspectionCount}
            label="Inspection"
            icon={<i className="bi bi-clipboard-check"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.PendingInspection));
            }}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.registerationCount}
            label="Pending Registration"
            icon={<i className="bi bi-dash"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.PendingRegisteration));
            }}
          />
        </div>

        <div className="col-md-3 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={data.onlineCount}
            label="Online"
            icon={<i className="bi bi-globe"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.Online));
            }}
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
