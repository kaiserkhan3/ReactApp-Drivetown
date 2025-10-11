import { Inventory, Status } from "@/models/inventory";
import { IoCloseCircleSharp } from "react-icons/io5";
import { TbMessageReport } from "react-icons/tb";
import { AiTwotoneCar } from "react-icons/ai";
import DialogModal from "../control-components/DialogModal";
import MarkAsSold from "./MarkAsSold";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import {
  updateisMarkAsSoldVisibleFlag,
  updateModalCloseState,
} from "@/app/store/modal-slice";
import { toast } from "react-toastify";
import { useInventoryCUD } from "@/hooks/useInventory";
import { useState } from "react";
import { ConfirmationDialogue } from "../control-components/ConfirmationDialogue";

type InventoryDetailsBtnControlsProps = {
  values: Inventory;
  close?: () => void;
};

export default function InventoryDetailsBtnControls({
  values,
  close,
}: InventoryDetailsBtnControlsProps) {
  const isMarkAsSoldVisible = useStoreSelector(
    (state) => state.modal.isMarkAsSoldVisible
  );

  const [isMarkAsUnSold, setIsMarkAsUnSold] = useState(false);

  const dispatch = useStoreDispatch();

  const { upsertInventory, isSuccess, isPending, status } = useInventoryCUD();

  const onNobtnClick = () => {
    setIsMarkAsUnSold(false);
  };

  const markAsUnsold = () => {
    setIsMarkAsUnSold(false);
    values.status = Status.available;
    values.isWholeSale = false;
    values.typeOfSale = "";
    values.documentFee = 0;
    values.titleRegisterationFee = 0;
    values.saleDate = undefined;
    values.salePrice = 0;
    values.isAllExpensesAdded = false;
    values.isTitleScanned = false;
    values.isContractScanned = false;

    upsertInventory(values);
    dispatch(updateisMarkAsSoldVisibleFlag({ isMarkAsSoldVisible: false }));
    toast.success(
      `${values.iYear} ${values.make} ${values.model} Marked as unsold successfully`
    );
  };

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
      {isMarkAsSoldVisible && (
        <DialogModal>
          <MarkAsSold initialValues={values} />
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
            <IoCloseCircleSharp size="20px" color="#fff" className="me-1" />
            Close
          </button>
        </div>
        <div className="d-flex gap-2">
          <button type="button" className="btn btn-info btn-hover">
            <TbMessageReport size="20px" color="#fff" className="me-1" />
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
              <AiTwotoneCar size="20px" color="#fff" className="me-2" />
              Mark As Sold
            </button>
          ) : (
            <button
              type="button"
              className="ms-auto btn btn-danger btn-hover"
              onClick={() => setIsMarkAsUnSold(true)}
            >
              <AiTwotoneCar size="20px" color="#fff" className="me-2" />
              Mark As UnSold
            </button>
          )}
        </div>
      </div>
    </>
  );
}
