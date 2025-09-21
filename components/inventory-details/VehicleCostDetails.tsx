"use client";
import { Inventory } from "@/models/inventory";
import { ChangeEvent } from "react";
import DialogModal from "../control-components/DialogModal";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateAddedCostModalCloseState } from "@/app/store/modal-slice";
import { AddedCostDetails } from "./AddedCostDetails";
import { useRepresentative } from "@/hooks/useInventory";
import { FormikErrors, FormikTouched } from "formik";

type VehicleCostDetailsProps = {
  inventoryId: number;
  values: Inventory;
  handleChange: (e?: React.ChangeEvent<any>) => void;
  setValues: (
    values: React.SetStateAction<Inventory>,
    shouldValidate?: boolean
  ) => void;
  errors: FormikErrors<Inventory>;
  touched: FormikTouched<Inventory>;
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
};

export default function VehicleCostDetails({
  inventoryId,
  values,
  handleChange,
  setValues,
  errors,
  touched,
  handleSubmit,
}: VehicleCostDetailsProps) {
  const { contractors } = useRepresentative();
  const isAddedCostModalVisible = useStoreSelector(
    (state) => state.modal.isAddedCostModalVisible
  );
  const dispatch = useStoreDispatch();

  const costControlsChaneHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleChange(event);
    const valueCheck = value === "" ? undefined : parseInt(value);
    setValues((prevState) => {
      return { ...prevState, [name]: valueCheck };
    });
  };

  function calculateTotalSalePriceAndProfit() {
    const isWholsale = values.typeOfSale === "Wholesale" || values.isWholeSale;
    const salePrice = values?.salePrice;

    if (!salePrice) return;

    const totalSalePrice = (
      (isWholsale ? 0 : 150) +
      (isWholsale ? 0 : 142) +
      (isWholsale ? 0 : salePrice * (6.25 / 100)) +
      salePrice -
      (values?.dealerFee ?? 0)
    ).toFixed(2);

    const calCulatedTotalSalePrice =
      totalSalePrice +
      " " +
      (isWholsale
        ? "- As sold type is wholesale, no fee added to sale price"
        : "- Includes document, title fee and sale tax");

    const profit = (
      parseInt(totalSalePrice) -
      (values.floorCost ?? 0) -
      (values.originalCost ?? 0) -
      (values.totalAddedCost ?? 0)
    ).toFixed(2);

    return { calCulatedTotalSalePrice, profit };
  }

  return (
    <>
      {isAddedCostModalVisible && (
        <DialogModal>
          <AddedCostDetails
            inventoryId={inventoryId}
            contractors={contractors!}
          />
        </DialogModal>
      )}
      <div className="card shadow-lg" style={{ width: "32rem" }}>
        <div className="card-body">
          <h5 className="card-title bg-warning p-2 text-center mb-3 text-white rounded">
            Vehicle cost details
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="form-floating col-md-6 px-2">
                <input
                  type="text"
                  className="form-control"
                  id="originalCost"
                  name="originalCost"
                  placeholder="Original Cost"
                  defaultValue={values.originalCost || undefined}
                  onChange={costControlsChaneHandler}
                />
                <label htmlFor="originalCost"> Original Cost</label>
                {errors?.originalCost && touched.originalCost && (
                  <p className="text-danger">{errors.originalCost}</p>
                )}
              </div>
              <div className="col-md-6 px-2">
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
                  Total Original Cost:
                  {(values.originalCost ?? 0) +
                    (values.totalAddedCost ?? 0) +
                    (values.floorCost ?? 0)}
                </p>
              </div>
              {/* <div className="form-floating col-md-6 px-2">
              <input
                type="text"
                className="form-control"
                id="floorCost"
                name="floorCost"
                placeholder="Floor Cost"
                defaultValue={values.floorCost || undefined}
                onChange={(e) => costControlsChaneHandler(e, "floorCost")}
              />
              <label htmlFor="originalCost"> Floor Cost</label>
              {errors?.floorCost && touched.floorCost && (
                <p className="text-danger">{errors.floorCost}</p>
              )}
            </div> */}
              <div className="form-floating col-md-6 px-2">
                <input
                  type="text"
                  className="form-control"
                  id="dealerFee"
                  name="dealerFee"
                  placeholder="Dealer Fee"
                  defaultValue={values.dealerFee || undefined}
                  onChange={costControlsChaneHandler}
                />
                <label htmlFor="dealerFee"> Dealer Fee</label>
                {errors?.dealerFee && touched.dealerFee && (
                  <p className="text-danger">{errors.dealerFee}</p>
                )}
              </div>
              <div className="form-floating col-md-6 px-2">
                <input
                  type="text"
                  className="form-control"
                  id="salePrice"
                  name="salePrice"
                  placeholder="Sale Price"
                  defaultValue={values.salePrice || undefined}
                  onChange={costControlsChaneHandler}
                />
                <label htmlFor="salePrice">Sale Price</label>
                {errors?.salePrice && touched.salePrice && (
                  <p className="text-danger">{errors.salePrice}</p>
                )}
              </div>

              <div className="form-floating col-md-6 px-2">
                <input
                  type="text"
                  className="form-control"
                  id="onlineCost"
                  name="onlineCost"
                  placeholder="Online Cost"
                  defaultValue={values.onlineCost || undefined}
                  onChange={costControlsChaneHandler}
                />
                <label htmlFor="onlineCost">Online Cost</label>
                {errors?.onlineCost && touched.onlineCost && (
                  <p className="text-danger">{errors.onlineCost}</p>
                )}
              </div>
              <div className="form-floating col-md-6 px-2">
                <input
                  type="text"
                  className="form-control"
                  id="reducedCost"
                  name="reducedCost"
                  placeholder="Reduced Cost"
                  defaultValue={values.reducedCost || undefined}
                  onChange={costControlsChaneHandler}
                />
                <label htmlFor="reducedCost">Reduced Cost</label>
                {errors?.reducedCost && touched.reducedCost && (
                  <p className="text-danger">{errors.reducedCost}</p>
                )}
              </div>
              <div className="col-12 px-2">
                {values?.salePrice != 0 && values.salePrice != undefined && (
                  <p className="mark p-2">
                    Total Sale Price: &nbsp;
                    <span style={{ color: "#5f95ed" }}>
                      {
                        calculateTotalSalePriceAndProfit()
                          ?.calCulatedTotalSalePrice
                      }
                    </span>
                    <br />
                    <span>Profit: </span>
                    <span style={{ color: "#5f95ed" }}>
                      $ {calculateTotalSalePriceAndProfit()?.profit}
                    </span>
                  </p>
                )}
              </div>
              <div className="form-floating col-12">
                <textarea
                  className="form-control"
                  placeholder="Leave note here"
                  id="notes"
                  name="notes"
                  style={{ height: "6rem" }}
                  value={values.notes || undefined}
                  onChange={handleChange}
                ></textarea>
                <label htmlFor="notes">Notes</label>
              </div>
              <div className="col-md-4"></div>
              <div className="col-md-6">
                <button className="btn btn-primary" type="submit">
                  Save Cost Details
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
