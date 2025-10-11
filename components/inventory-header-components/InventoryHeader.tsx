"use client";
import * as React from "react";
import Vehicle from "@/public/d-image.jpg";
import { VehcilesCountByOnlineStatus } from "@/models/inventory/models";
import { OnlineStatus, Status } from "@/models/inventory/enum";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateOnlineStatus, updateStatus } from "@/app/store/search-slice";

function InventoryHeader() {
  const dispatch = useStoreDispatch();
  const invCountByOnlineStatus = useStoreSelector((state) => state.commonData);

  return (
    <div className="rounded-3  shadow-lg p-3 mb-3">
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-primary btn-hover"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.Online));
          }}
        >
          <i className="bi bi-globe"></i> Online (
          {invCountByOnlineStatus?.onlineCount})
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.NotOnline));
          }}
        >
          <i className="bi bi-ban"></i> Not Online (
          {invCountByOnlineStatus?.notOnlineCount})
        </button>
        <button
          type="button"
          className="btn btn-info"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.OnlineBelow30Days));
          }}
        >
          <i className="bi bi-globe"></i> Online &lt; 30 Days (
          {invCountByOnlineStatus?.lessthan30DaysCount})
        </button>
        <button
          type="button"
          className="btn btn-warning"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.OnlineBetween3060days));
          }}
        >
          <i className="bi bi-globe"></i> Online between 30 - 60 Days (
          {invCountByOnlineStatus?.between3060daysCount})
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.OnlineAbove60Days));
          }}
        >
          <i className="bi bi-globe"></i> Online &gt; 60 Days (
          {invCountByOnlineStatus?.moreThan60DaysCount})
        </button>
        <button
          type="button"
          className="btn btn-success"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.WholeSale));
          }}
        >
          <i className="bi bi-truck"></i> Whole Sale (
          {invCountByOnlineStatus?.wholesaleCount})
        </button>
        <button
          type="button"
          className="btn btn-dark"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.RepairShop));
          }}
        >
          <i className="bi bi-tools"></i> Repair Shop (
          {invCountByOnlineStatus?.repairShopCount})
        </button>
        <button
          type="button"
          className="btn btn-success btn-hover"
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.All));
          }}
        >
          <i className="bi bi-ban"></i> All (
          {invCountByOnlineStatus?.availableVehiclesCount})
        </button>
      </div>
    </div>
  );
}

export default React.memo(InventoryHeader);
