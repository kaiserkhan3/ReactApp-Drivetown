"use client";

import { useStoreDispatch } from "@/app/store/hook";
import {
  updateIsDetailViewFlag,
  updateModalCloseState,
} from "@/app/store/modal-slice";

export const InventoryPageHeader = () => {
  const dispatch = useStoreDispatch();

  return (
    <>
      <button
        className="btn btn-primary"
        onClick={() => {
          dispatch(updateModalCloseState({ modalVisible: true }));
          dispatch(updateIsDetailViewFlag({ isDetailsView: false }));
        }}
      >
        <i className="bi bi-plus-lg"></i> Add Vehicle
      </button>
      <div className="dropdown">
        <button
          className="btn btn-outline-secondary dropdown-toggle"
          type="button"
          id="exportDropdown"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="bi bi-download"></i> Export
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="exportDropdown"
        >
          <li>
            <a className="dropdown-item" href="#">
              <i className="bi bi-file-earmark-excel"></i> Excel
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              <i className="bi bi-filetype-csv"></i> CSV
            </a>
          </li>
          <li>
            <a className="dropdown-item" href="#">
              <i className="bi bi-filetype-pdf"></i> PDF
            </a>
          </li>
        </ul>
      </div>
    </>
  );
};
