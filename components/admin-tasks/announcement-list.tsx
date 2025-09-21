"use client";
import { getNewVehicleDropdownData } from "@/actions/inventory-actions";
import DialogModal from "../control-components/DialogModal";
import { AddContractor } from "./add-contractors";
import { useState } from "react";
import { useRepresentative } from "@/hooks/useInventory";

export const AnnouncementList = () => {
  const { announcement } = useRepresentative();
  const [showDialog, setShowDialog] = useState(false);
  const [repId, setRepId] = useState<number | undefined>(undefined);

  const editBtnClickHandler = (repId: number) => {
    setRepId(repId);
    setShowDialog(true);
  };

  const handleCreateContractorBtnClick = () => {
    setRepId(undefined);
    setShowDialog(true);
  };

  const closeDailogue = () => {
    setShowDialog(false);
  };

  return (
    <>
      {showDialog && (
        <DialogModal>
          <AddContractor type="Announcement" id={repId} close={closeDailogue} />
        </DialogModal>
      )}
      <div className="mt-5 shadow">
        <div className="mb-3 me-5 pt-3" style={{ textAlign: "right" }}>
          <button
            type="button"
            className="btn btn-primary btn-hover"
            onClick={handleCreateContractorBtnClick}
          >
            Create Announcement
          </button>
        </div>
        <div className="inventory-list">
          <div className="inventory-table-container">
            <table className="inventory-table table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Category</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {announcement?.map((row, index) => (
                  <tr key={row.representativeId}>
                    <td>{index + 1}</td>
                    <td>{`${row.representativeFirstName}`}</td>
                    <td>{row.representativeLastName}</td>
                    <td>
                      <div className="todo-actions">
                        <button
                          className="btn btn-sm btn-icon"
                          title="View"
                          onClick={() =>
                            editBtnClickHandler(row.representativeId!)
                          }
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-icon" title="Delete">
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
