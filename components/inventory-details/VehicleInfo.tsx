"use client";
import { Inventory } from "@/models/inventory";
import defaultImage from "../control-components/defaultCar.png";
import classes from "./inventoryDetails.module.css";
import moment from "moment";
import DialogModal from "../control-components/DialogModal";
import AddEditVehicle from "../new-vehicle/add-edit-vehicle";
import { useEffect, useState } from "react";
import { updateAddedCostModalCloseState } from "@/app/store/modal-slice";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { AddedCostDetails } from "./AddedCostDetails";
import { useRepresentative } from "@/hooks/useInventory";
import Link from "next/link";

export default function VehicleInfo({ inventory }: { inventory: Inventory }) {
  //const [isAddedCostModalVisible, setIsAddedCostModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [row, setRow] = useState<Inventory>(inventory);

  const updateVehicleInfo = (row: Inventory) => {
    setRow(row);
  };

  useEffect(() => {
    if (inventory) {
      setRow(inventory);
    }
  }, [inventory]);

  const imageUrl = row?.imageName
    ? `${process.env.NEXT_PUBLIC_SHARED_FOLDER_URL!}vehicle/${row?.imageName}`
    : defaultImage.src;

  return (
    <>
      {modalVisible && (
        <DialogModal top={"1rem"}>
          <AddEditVehicle
            item={row! as Inventory}
            setItemUndefined={() => setModalVisible(false)}
            updateVehicleInfo={updateVehicleInfo}
          />
        </DialogModal>
      )}

      <div className="card shadow-lg" style={{ width: "20rem" }}>
        <div className="card-body">
          <div
            style={{
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "cover",
              height: "10rem",
              marginBottom: "1rem",
            }}
          ></div>
          <h5 className="card-title">{`${row?.iYear} ${row?.make} ${row?.model}`}</h5>
          <h6 className="card-subtitle mb-2 text-muted">VIN: {row?.vin}</h6>
          <p className={classes.cardText}>Color: {row?.color}</p>
          <p className={classes.cardText}>
            Number of Keys: {row?.numberOfKeys}
          </p>
          {row?.purchaseDate && (
            <p className={classes.cardText}>
              Purchase Date:
              {moment.utc(row?.purchaseDate).format("MM-DD-YYYY")}
            </p>
          )}
          {row?.purchaseFrom && (
            <p className={classes.cardText}>
              Purchase From: {row?.purchaseFrom}
            </p>
          )}
          <div className="d-flex justify-content-between align-items-center">
            <button
              type="button"
              className="btn btn-secondary btn-sm mt-2"
              onClick={() => setModalVisible(true)}
            >
              <i className="bi bi-pencil-fill  me-2"></i>
              Edit
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
