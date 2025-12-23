"use client";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { DashboardHeaderCard } from "./dashboard-header-card";
import { useState, useEffect } from "react";
import DialogModal from "../control-components/DialogModal";
import NewInventory from "../inventory-list-components/new-inventory";
import {
  updateAcv,
  updateOnlineStatus,
  updateOve,
} from "@/app/store/search-slice";
import { OnlineStatus } from "@/models/inventory";
import { useUserData } from "@/hooks/useUserData";

export const DashboardCard = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dispatch = useStoreDispatch();
  const data = useStoreSelector((state) => state.commonData);
  const { role } = useUserData();

  // Guard to avoid rendering client-only values during SSR which can cause
  // hydration mismatches. Render deterministic placeholders until mounted.
  useEffect(() => {
    setMounted(true);
  }, []);
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
        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.availableVehiclesCount : 0}
            label="Showroom"
            icon={<i className="bi bi-shop"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.All));
            }}
          />
        </div>
        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.appoinmentsCount : 0}
            label="Appointments"
            icon={<i className="bi bi-calendar-check"></i>}
          />
        </div>

        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.repairShopCount : 0}
            label="Repair Shop"
            icon={<i className="bi bi-tools"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.RepairShop));
            }}
          />
        </div>

        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.wholesaleCount : 0}
            label="Whole Sale"
            icon={<i className="bi bi-truck"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.WholeSale));
            }}
          />
        </div>
        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.acvCount : 0}
            label="ACV Online"
            icon={<i className="bi bi-globe" style={{ color: "green" }}></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateAcv(true));
            }}
          />
        </div>
        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.oveCount : 0}
            label="OVE Online"
            icon={<i className="bi bi-globe" style={{ color: "green" }}></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOve(true));
            }}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.inspectionCount : 0}
            label="Inspection"
            icon={<i className="bi bi-clipboard-check"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.PendingInspection));
            }}
          />
        </div>

        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.registerationCount : 0}
            label="Pending Registration"
            icon={<i className="bi bi-dash"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.PendingRegisteration));
            }}
          />
        </div>

        <div className="col-md-2 col-sm-6 mb-4">
          <DashboardHeaderCard
            count={mounted ? data.onlineCount : 0}
            label="Online"
            icon={<i className="bi bi-globe"></i>}
            clickEvent={() => {
              setModalVisible(true);
              dispatch(updateOnlineStatus(OnlineStatus.Online));
            }}
          />
        </div>
        {mounted && role === "Admin" && (
          <div className="col-md-2 col-sm-6 mb-4">
            <DashboardHeaderCard
              count={"$ " + data.monthlyProfit}
              label="Monthly Profit"
              icon={<i className="bi bi-cash-coin"></i>}
            />
          </div>
        )}
      </div>
    </>
  );
};
