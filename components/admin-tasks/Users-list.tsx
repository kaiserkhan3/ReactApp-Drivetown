"use client";
import { CreateUser } from "./create-user";
import DialogModal from "../control-components/DialogModal";
import { useState } from "react";
import { getUserShortInfoWithRolehook } from "@/hooks/useUserData";

export const UsersList = () => {
  const [userId, setUserId] = useState<number | undefined>(undefined);
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const { usersInfo } = getUserShortInfoWithRolehook();

  const handleEditBtnClick = (userId: number) => {
    setUserId(userId);
    setShowDialog(true);
  };

  const handleCreateUserBtnClick = () => {
    setUserId(undefined);
    setShowDialog(true);
  };

  const closeDialogue = () => {
    setShowDialog(false);
  };

  return (
    <>
      {showDialog && (
        <DialogModal>
          <CreateUser userId={userId} closeBtnHandler={closeDialogue} />
        </DialogModal>
      )}
      <div className="mt-5 shadow">
        <div className="mb-3 me-5 pt-3" style={{ textAlign: "right" }}>
          <button
            type="button"
            className="btn btn-primary btn-hover"
            onClick={handleCreateUserBtnClick}
          >
            Create User
          </button>
        </div>
        <div className="inventory-list">
          <div className="inventory-table-container">
            <table className="inventory-table table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User Name</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {usersInfo &&
                  usersInfo.map((row, index) => (
                    <tr key={row.userId}>
                      <td>{index + 1}</td>
                      <td>{row.userName}</td>
                      <td>{row.role}</td>

                      <td>
                        <div className="todo-actions">
                          <button
                            className="btn btn-sm btn-icon"
                            title="View"
                            onClick={() => handleEditBtnClick(row.userId)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-icon"
                            title="Delete"
                          >
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
