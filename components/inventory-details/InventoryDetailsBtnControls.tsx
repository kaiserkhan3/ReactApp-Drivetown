import { Inventory, Status } from "@/models/inventory";
import DialogModal from "../control-components/DialogModal";
import MarkAsSold from "./MarkAsSold";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import {
  updateAddedCostModalCloseState,
  updateisMarkAsSoldVisibleFlag,
  updateModalCloseState,
} from "@/app/store/modal-slice";
import { toast } from "react-toastify";
import { useInventoryCUD } from "@/hooks/useInventory";
import { useEffect, useState } from "react";
import { ConfirmationDialogue } from "../control-components/ConfirmationDialogue";
import { SendSms } from "../sms-history/send-sms";
import { useUserData } from "@/hooks/useUserData";

type InventoryDetailsBtnControlsProps = {
  inventory: Inventory;
  close?: () => void;
};

export default function InventoryDetailsBtnControls({
  inventory,
  close,
}: InventoryDetailsBtnControlsProps) {
  const isMarkAsSoldVisible = useStoreSelector(
    (state) => state.modal.isMarkAsSoldVisible
  );
  const [values, setValues] = useState<Inventory | undefined>(inventory);
  const [isMarkAsUnSold, setIsMarkAsUnSold] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [isReportProblemVisible, setIsReportProblemVisible] = useState(false);
  const { role, userId } = useUserData();
  const dispatch = useStoreDispatch();

  const { upsertInventory, isSuccess, isPending, status } = useInventoryCUD();

  const onNobtnClick = () => {
    setIsMarkAsUnSold(false);
  };

  const updateInventoryWhenMarkAsSold = (inventory?: Inventory) => {
    if (inventory) setValues(inventory);
  };

  const closeReportProblemDialog = () => {
    setIsReportProblemVisible(false);
  };

  const markAsUnsold = () => {
    setIsMarkAsUnSold(false);
    if (!values) {
      toast.error("Unable to mark as unsold: missing inventory data");
      return;
    }

    const newValues: Inventory = {
      ...values,
      updatedById: userId,
      status: Status.available,
      isWholeSale: false,
      typeOfSale: "",
      documentFee: 0,
      titleRegisterationFee: 0,
      saleDate: undefined,
      salePrice: 0,
      isAllExpensesAdded: false,
      isTitleScanned: false,
      isContractScanned: false,
    };

    upsertInventory(newValues);
    setValues(newValues);
    dispatch(updateisMarkAsSoldVisibleFlag({ isMarkAsSoldVisible: false }));
    toast.success(
      `${newValues.iYear} ${newValues.make} ${newValues.model} Marked as unsold successfully`
    );
  };

  const archieveVehicle = () => {
    if (!values) {
      toast.error("Unable to mark as unsold: missing inventory data");
      return;
    }

    const newValues: Inventory = {
      ...values,
      status: Status.archive,
      updatedById: userId,
    };

    upsertInventory(newValues);
    setValues(newValues);
    toast.success(`Vehicle archived successfully!`);
  };

  const deleteVehicle = () => {
    if (!values) {
      toast.error("Unable to mark as unsold: missing inventory data");
      return;
    }

    const newValues: Inventory = {
      ...values,
      status: Status.delete,
      updatedById: userId,
    };

    upsertInventory(newValues);
    setValues(newValues);
    toast.success(`Vehicle deleted successfully!`);
    dispatch(updateModalCloseState({ modalVisible: false }));
  };

  useEffect(() => {
    if (inventory) {
      setValues(inventory);
    }
  }, [inventory]);

  return (
    <>
      {isMarkAsUnSold && (
        <DialogModal>
          <ConfirmationDialogue
            header="Are You Sure?"
            body="Do you want to mark it as unsold?"
            onNoBtnClick={onNobtnClick}
            onYesBtnClick={markAsUnsold}
          />
        </DialogModal>
      )}
      {isDelete && (
        <DialogModal>
          <ConfirmationDialogue
            header="Are You Sure?"
            body="Do you want to delete this vehicle?"
            onNoBtnClick={() => setIsDelete(false)}
            onYesBtnClick={deleteVehicle}
          />
        </DialogModal>
      )}
      {isReportProblemVisible && (
        <DialogModal>
          <SendSms
            close={closeReportProblemDialog}
            toNumber="8324619997"
            initialMessage={`Reporting Problem On: ${values?.iYear} ${values?.make} ${values?.model} ${values?.vin?.slice(-5)}`}
          />
        </DialogModal>
      )}
      {isMarkAsSoldVisible && values && (
        <DialogModal>
          <MarkAsSold
            initialValues={values}
            updateInventoryWhenMarkAsSold={updateInventoryWhenMarkAsSold}
          />
        </DialogModal>
      )}
      <div className="d-flex flex-wrap justify-content-between shadow-lg p-3">
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-outline-danger btn-hover"
            onClick={() =>
              close
                ? close()
                : dispatch(updateModalCloseState({ modalVisible: false }))
            }
          >
            <i className="bi bi-x-circle text-danger me-2"></i>
            Close
          </button>
        </div>
        {role === "Admin" && (
          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn btn-danger btn-hover"
              onClick={() => setIsDelete(true)}
            >
              <i className="bi bi-trash text-white me-2"></i>
              Delete
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-hover"
              onClick={archieveVehicle}
            >
              <i className="bi bi-archive me-2"></i>
              Archive
            </button>
          </div>
        )}

        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-hover text-white"
            style={{ backgroundColor: "#9400D3" }}
            onClick={(e) => {
              e.preventDefault();
              dispatch(
                updateAddedCostModalCloseState({
                  isAddedCostModalVisible: true,
                })
              );
            }}
          >
            <i className="bi bi-cash text-white me-2"></i>
            Added Cost: ${values?.totalAddedCost ?? 0}
          </button>
          <button
            type="button"
            className="btn btn-info btn-hover"
            onClick={() => setIsReportProblemVisible(true)}
          >
            <i className="bi bi-chat-left text-white me-2"></i>
            Report Problem
          </button>
          {values?.status === Status.available ? (
            <button
              type="button"
              className="ms-auto btn btn-success btn-hover"
              onClick={() =>
                dispatch(
                  updateisMarkAsSoldVisibleFlag({ isMarkAsSoldVisible: true })
                )
              }
            >
              <i className="bi bi-car-front text-white me-2"></i>
              Mark As Sold
            </button>
          ) : (
            <button
              type="button"
              className="ms-auto btn btn-danger btn-hover"
              onClick={() => setIsMarkAsUnSold(true)}
            >
              <i className="bi bi-car-front text-white me-2"></i>
              Mark As UnSold
            </button>
          )}
        </div>
      </div>
    </>
  );
}
