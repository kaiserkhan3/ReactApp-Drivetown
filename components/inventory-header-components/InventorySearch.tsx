"use client";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import {
  updateDisplayType,
  updateMake,
  updateSearchText,
  updateStatus,
  updateYear,
} from "@/app/store/search-slice";
import { useVehicleMake } from "@/hooks/useInventory";
import { ChangeEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { MdGridView } from "react-icons/md";
import { IoIosList } from "react-icons/io";

export default function InventorySearch() {
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
  const makeChnageHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "all") {
      dispatch(updateMake(undefined));
    } else {
      dispatch(updateMake(value));
    }
  };

  const yearCheangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "all") {
      dispatch(updateYear(undefined));
    } else {
      dispatch(updateYear(value));
    }
  };

  return (
    <div className="container-fluid mb-4 shadow-lg p-3 rounded">
      <div className="row row-cols-1 row-cols-lg-4">
        <div className="col">
          <label className="form-label" htmlFor="search">
            Search
          </label>
          <div className="input-group mb-3">
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
              onChange={searchTextChangeHandler}
            />
          </div>
        </div>
        <div className="col">
          <label className="form-label" htmlFor="make">
            Make
          </label>
          <select
            className="form-select"
            name="make"
            id="make"
            aria-label="Default select example"
            defaultValue="all"
            onChange={makeChnageHandler}
          >
            <option key="allMakes" value="all">
              All Makes
            </option>
            {makeList?.map((make) => (
              <option key={make.vehicleMakeId} value={make.vehicleMakeName}>
                {make.vehicleMakeName}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="form-label" htmlFor="year">
            Year
          </label>
          <select
            className="form-select"
            name="year"
            id="year"
            aria-label="Default select example"
            onChange={yearCheangeHandler}
          >
            <option key="allYears" value="all">
              All Years
            </option>
            {range(1900, new Date().getFullYear())?.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="col">
          <label className="form-label" htmlFor="make">
            Status
          </label>
          <select
            className="form-select"
            name="make"
            id="make"
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
      <div className="d-flex pt-1 ">
        <div>
          <button type="button" className="btn btn-primary">
            Apply Filters
          </button>
        </div>
        <div
          className="ms-auto btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            onClick={() => dispatch(updateDisplayType("list"))}
            className={`btn ${displayType === "list" ? "btn-primary" : "btn-outline-primary"} `}
          >
            <MdGridView /> List
          </button>
          <button
            type="button"
            onClick={() => dispatch(updateDisplayType("grid"))}
            className={`btn ${displayType === "grid" ? "btn-primary" : "btn-outline-primary"} `}
          >
            <IoIosList /> Grid
          </button>
        </div>
      </div>
    </div>
  );
}
