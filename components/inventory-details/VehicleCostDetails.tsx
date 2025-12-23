"use client";
import { Inventory } from "@/models/inventory";
import { ChangeEvent } from "react";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateAddedCostModalCloseState } from "@/app/store/modal-slice";
import { FormikErrors, FormikTouched } from "formik";
import Link from "next/link";

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
    const salePrice = values?.salePrice;

    if (!salePrice) return;

    const totalSalePrice = (salePrice - (values?.dealerFee ?? 0)).toFixed(2);

    const profit = (
      parseInt(totalSalePrice) -
      (values?.floorCost ?? 0) -
      (values?.originalCost ?? 0) -
      (values?.totalAddedCost ?? 0) -
      (values?.addedCostFromDailyExpenses ?? 0)
    ).toFixed(2);

    return { totalSalePrice, profit };
  }

  return (
    <>
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
                <p className="mark" style={{ fontSize: "12px" }}>
                  <Link
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
                    Added Cost: ${values?.totalAddedCost ?? 0}
                  </Link>
                  <br />
                  Cost From DailyExpenses: $
                  {values.addedCostFromDailyExpenses ?? 0}
                  <br />
                  Total Original Cost: $
                  {(values?.originalCost ?? 0) +
                    (values?.totalAddedCost ?? 0) +
                    (values?.floorCost ?? 0) +
                    (values?.addedCostFromDailyExpenses ?? 0)}
                </p>
              </div>
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

              <div className="col-12 px-2">
                {values?.salePrice != 0 && values.salePrice != undefined && (
                  <p className="mark p-2">
                    Total Sale Price: &nbsp;
                    <span style={{ color: "#5f95ed" }}>
                      {calculateTotalSalePriceAndProfit()?.totalSalePrice}
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
                  <i className="bi bi-floppy2 text-white me-2"></i>
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
