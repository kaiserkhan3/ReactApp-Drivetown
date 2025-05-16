import { Inventory } from "@/models/inventory";
import { SwitchCol, SwitchRow } from "./VehicleOngoingDetails";
import {
  ChangeEvent,
  FormEvent,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { FormikProvider } from "formik";
import DialogModal from "../control-components/DialogModal";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateAddedCostModalCloseState } from "@/app/store/modal-slice";
import { AddedCostDetails } from "./AddedCostDetails";

type VehicleCostDetailsProps = {
  inventoryId: number;
  values: Inventory;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
  handleChange: (e?: React.ChangeEvent<any>) => void;
};

export default function VehicleCostDetails({
  inventoryId,
  handleSubmit,
  values,
  handleChange,
}: VehicleCostDetailsProps) {
  const isAddedCostModalVisible = useStoreSelector(
    (state) => state.modal.isAddedCostModalVisible
  );
  const dispatch = useStoreDispatch();
  const [totalSaleprice, setTotalSaleprice] = useState<number | string>();
  const colSpan1 = 6;
  const colSpan2 = 6;

  const calculateTotalSaleCost = () => {
    if (values?.salePrice)
      return 150 + 142 + 0.0625 * values.salePrice + values.salePrice;
  };

  return (
    <>
      {isAddedCostModalVisible && (
        <DialogModal>
          <AddedCostDetails inventoryId={inventoryId} />
        </DialogModal>
      )}
      <div className="card shadow-lg" style={{ width: "30rem" }}>
        <div className="card-body">
          <h5 className="card-title bg-warning p-2 text-center mb-3 text-white rounded">
            Vehicle cost details
          </h5>
          <SwitchRow>
            <SwitchCol colSpan={colSpan1}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="originalCost"
                  name="originalCost"
                  placeholder="Original Cost"
                  defaultValue={values.originalCost || ""}
                  onChange={handleChange}
                />
                <label htmlFor="originalCost"> Original Cost</label>
              </div>
            </SwitchCol>
            <SwitchCol colSpan={colSpan1}>
              <p className="mark">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(
                      updateAddedCostModalCloseState({
                        isAddedCostModalVisible: true,
                      })
                    );
                  }}
                  style={{ color: "#5f95ed", cursor: "pointer" }}
                >
                  Added Cost: {values.totalAddedCost}
                </a>
                <br />
                Total Original Cost: {values.totalOriginalCost}
              </p>
            </SwitchCol>
          </SwitchRow>
          <SwitchRow>
            <SwitchCol colSpan={colSpan1}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="floorCost"
                  name="floorCost"
                  placeholder="Floor Cost"
                  defaultValue={values.floorCost || ""}
                  onChange={handleChange}
                />
                <label htmlFor="originalCost"> Floor Cost</label>
              </div>
            </SwitchCol>
            <SwitchCol colSpan={colSpan1}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="dealerFee"
                  name="dealerFee"
                  placeholder="Floor Cost"
                  defaultValue={values.dealerFee || ""}
                  onChange={handleChange}
                />
                <label htmlFor="dealerFee"> Dealer Fee</label>
              </div>
            </SwitchCol>
          </SwitchRow>
          <SwitchRow>
            <SwitchCol colSpan={colSpan1}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="salePrice"
                  name="salePrice"
                  placeholder="Floor Cost"
                  defaultValue={values.salePrice || ""}
                  onChange={handleChange}
                />
                <label htmlFor="salePrice">Sale Price</label>
              </div>
            </SwitchCol>
            <SwitchCol colSpan={colSpan1}>
              <p className="mark p-2">
                Total Sale Price:{" "}
                <span style={{ color: "#5f95ed" }}>
                  {calculateTotalSaleCost()}
                </span>{" "}
                <br />
                {values.profit && (
                  <>
                    Profit:{" "}
                    <span style={{ color: "#5f95ed" }}> {values.profit}</span>
                  </>
                )}
              </p>
            </SwitchCol>
          </SwitchRow>

          <SwitchRow>
            <SwitchCol colSpan={12}>
              <div className="form-floating">
                <textarea
                  className="form-control"
                  placeholder="Leave note here"
                  id="notes"
                  name="notes"
                  style={{ height: "6rem" }}
                  defaultValue={values.notes}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="notes">Notes</label>
              </div>
            </SwitchCol>
          </SwitchRow>
          <SwitchRow>
            <SwitchCol colSpan={12}>
              <div className="d-grid gap-2">
                <button className="btn btn-primary" type="submit">
                  Save Cost Details
                </button>
              </div>
            </SwitchCol>
          </SwitchRow>
        </div>
      </div>
    </>
  );
}
