"use client";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import {
  updateDisplayType,
  updateMake,
  updateOnlineStatus,
  updateSearchText,
  updateStatus,
  updateYear,
} from "@/app/store/search-slice";
import { useVehicleMake } from "@/hooks/useInventory";
import { OnlineStatus, Status } from "@/models/inventory";
import { ChangeEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";

// bootstrapVars.ts
export const compactBtnStyles: React.CSSProperties = {
  "--bs-btn-padding-y": "0.25rem",
  "--bs-btn-padding-x": "0.5rem",
  "--bs-btn-font-size": "0.75rem",
} as React.CSSProperties;

export default function InventorySearch() {
  const status = useStoreSelector((state) => state.search.status);
  const make = useStoreSelector((state) => state.search.make);
  const year = useStoreSelector((state) => state.search.year);
  const searchText = useStoreSelector((state) => state.search.searchText);
  const invCountByOnlineStatus = useStoreSelector((state) => state.commonData);
  // Online statueses
  const onlineStatusButtons = [
    {
      label: "Online",
      icon: "bi-globe",
      status: OnlineStatus.Online,
      count: invCountByOnlineStatus?.onlineCount,
      variant: "primary",
    },
    {
      label: "Not Online",
      icon: "bi-ban",
      status: OnlineStatus.NotOnline,
      count: invCountByOnlineStatus?.notOnlineCount,
      variant: "secondary",
    },
    {
      label: "Online < 30 Days",
      icon: "bi-globe",
      status: OnlineStatus.OnlineBelow30Days,
      count: invCountByOnlineStatus?.lessthan30DaysCount,
      variant: "info",
    },
    {
      label: "Online 30 - 60 Days",
      icon: "bi-globe",
      status: OnlineStatus.OnlineBetween3060days,
      count: invCountByOnlineStatus?.between3060daysCount,
      variant: "warning",
    },
    {
      label: "Online > 60 Days",
      icon: "bi-globe",
      status: OnlineStatus.OnlineAbove60Days,
      count: invCountByOnlineStatus?.moreThan60DaysCount,
      variant: "danger",
    },
    {
      label: "Whole Sale",
      icon: "bi-truck",
      status: OnlineStatus.WholeSale,
      count: invCountByOnlineStatus?.wholesaleCount,
      variant: "success",
    },
    {
      label: "Repair Shop",
      icon: "bi-tools",
      status: OnlineStatus.RepairShop,
      count: invCountByOnlineStatus?.repairShopCount,
      variant: "dark",
    },
    {
      label: "All",
      icon: "bi-ban",
      status: OnlineStatus.All,
      count: invCountByOnlineStatus?.availableVehiclesCount,
      variant: "success",
      extraClass: "btn-hover",
    },
  ];
  // Tankstack hooks
  const { makeList } = useVehicleMake();
  //store selector
  const { displayType, status: defaultStatus } = useStoreSelector(
    (state) => state.search
  );
  //store dispatcher
  const dispatch = useStoreDispatch();
  const range = (start: number, end: number) =>
    [...Array(end - start + 1).keys()].map((i) => i + start);

  const statusChangeHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    if (e.target.value === "all") dispatch(updateDisplayType("grid"));

    dispatch(updateStatus(e.target.value));
  };

  const searchTextChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value.length >= 4) {
      dispatch(updateSearchText(value));
    } else {
      dispatch(updateSearchText(undefined));
    }
  };
  const makeChnageHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "all") {
      dispatch(updateMake(undefined));
    } else {
      dispatch(updateMake(value));
    }
  };

  const yearCheangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (value === "all") {
      dispatch(updateYear(undefined));
    } else {
      dispatch(updateYear(value));
    }
  };

  return (
    <div className="p-3 mb-3 shadow-lg rounded-3">
      <div className="row row-cols-1 row-cols-lg-4">
        <div className="col">
          <label className="form-label" htmlFor="search">
            Search
          </label>
          <div className="input-group ">
            <span className="input-group-text" id="basic-addon1">
              <IoSearchOutline />
            </span>
            <input
              type="text"
              id="search"
              name="search"
              className="form-control"
              placeholder="Search by vin, at least 4 characters required"
              aria-label="search"
              aria-describedby="search"
              defaultValue={searchText}
              onChange={searchTextChangeHandler}
            />
          </div>
        </div>
        <div className="col">
          <label className="form-label" htmlFor="makes">
            Make
          </label>
          <input
            type="text"
            className="form-control"
            id="makes"
            name="makes"
            list="make-list"
            placeholder="Enter a make"
            value={make}
            onChange={makeChnageHandler}
          />
          <datalist id="make-list">
            {makeList?.map((make) => (
              <option key={make.vehicleMakeId} value={make.vehicleMakeName} />
            ))}
          </datalist>
        </div>
        <div className="col">
          <label className="form-label" htmlFor="year">
            Year
          </label>
          <input
            type="text"
            className="form-control"
            id="year"
            name="year"
            list="year-list"
            placeholder="Enter a year"
            value={year}
            onChange={yearCheangeHandler}
          />
          <datalist id="year-list">
            {range(1900, new Date().getFullYear())?.map((year) => (
              <option key={year} value={year} />
            ))}
          </datalist>
        </div>
        <div className="col">
          <label className="form-label" htmlFor="status">
            Status
          </label>
          <select
            className="form-select"
            name="status"
            id="status"
            aria-label="Default select example"
            defaultValue={defaultStatus}
            onChange={statusChangeHandler}
          >
            <option key="allStatus" value="all">
              All Status
            </option>
            <option key="Available" value="Available">
              Available
            </option>
            <option key="Sold" value="Sold">
              Sold
            </option>
            <option key="Archive" value="Archive">
              Archive
            </option>
          </select>
        </div>
      </div>
      <div className="d-flex gap-1 flex-wrap">
        {onlineStatusButtons.map(
          ({ label, icon, status, count, variant, extraClass }) => (
            <button
              key={status}
              type="button"
              className={`btn btn-${variant} ${extraClass ?? ""}`}
              style={compactBtnStyles}
              onClick={() => {
                dispatch(updateStatus(Status.available));
                dispatch(updateOnlineStatus(status));
              }}
            >
              <i className={`bi ${icon}`}></i> {label} ({count})
            </button>
          )
        )}

        <button
          key="purchased"
          type="button"
          className="btn"
          style={{
            ...compactBtnStyles,
            background: "purple",
            color: "white",
          }}
          onClick={() => {
            dispatch(updateStatus(Status.available));
            dispatch(updateOnlineStatus(OnlineStatus.isPurchased));
          }}
        >
          <i className="bi bi-car-front text-white me-2"></i>
          Recently Marked As Purchased
        </button>

        <div
          className="ms-auto btn-group"
          role="group"
          aria-label="Display type toggle"
        >
          {["list", "grid"].map((val) => (
            <button
              key={val}
              type="button"
              style={compactBtnStyles}
              onClick={() =>
                dispatch(updateDisplayType(val === "list" ? "list" : "grid"))
              }
              className={`btn ${displayType === val ? "btn-primary" : "btn-outline-primary"}`}
            >
              <i className={`bi bi-${val === "list" ? "list-ul" : "grid"}`}></i>
              {val.charAt(0).toUpperCase() + val.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
