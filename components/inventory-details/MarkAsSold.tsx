"use client";
import { Inventory, Status } from "@/models/inventory";
import { FormikHelpers, useFormik } from "formik";
import { markAsSoldSchema } from "@/Schemas";
import moment from "moment";
import { useInventoryCUD, useRepresentative } from "@/hooks/useInventory";
import { ChangeEvent, useState } from "react";
import { IoCloseCircleSharp } from "react-icons/io5";
import { FaRegSave } from "react-icons/fa";
import { SwitchCol, SwitchRow } from "./VehicleOngoingDetails";
import { useStoreDispatch } from "@/app/store/hook";
import { updateisMarkAsSoldVisibleFlag } from "@/app/store/modal-slice";
import { toast } from "react-toastify";
import { formatPhoneNumber, unFormatPhoneNumber } from "@/utilities";

type MarkAsSoldProps = {
  initialValues: Inventory;
};

export default function MarkAsSold({ initialValues }: MarkAsSoldProps) {
  const [phoneNumber, setPhoneNumber] = useState();
  const { refferedBy } = useRepresentative();
  const dispatch = useStoreDispatch();

  const { upsertInventory, data } = useInventoryCUD();
  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<Inventory>({
    initialValues: Object.assign(initialValues, {
      saleDate: moment().format("YYYY-MM-DD"),
    }),
    enableReinitialize: true,
    validationSchema: markAsSoldSchema,
    onSubmit: (values, actions) => submitHandler(values, actions),
  });

  const submitHandler = (
    values: Inventory,
    actions: FormikHelpers<Inventory>
  ) => {
    const isWholsale = values.typeOfSale === "Wholesale";
    const salePrice = values.salePrice;
    values.status = Status.sold;
    values.isWholeSale = isWholsale ? true : false;
    values.documentFee = isWholsale ? 0 : 150;
    values.titleRegisterationFee = isWholsale ? 0 : 142;
    values.saleTax = isWholsale ? 0 : salePrice! * (6.25 / 100);
    values.customerPhoneNumber = unFormatPhoneNumber(
      values.customerPhoneNumber!
    );
    upsertInventory(values);
    dispatch(updateisMarkAsSoldVisibleFlag({ isMarkAsSoldVisible: false }));
    // toast.success(
    //   `${values.iYear} ${values.make} ${values.model} Marked to sold successfully`
    // );
    toast.success(data?.message);
  };

  const phoneNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const value = formatPhoneNumber(event.target.value);
    if (!value) return;
    setValues((prevState) => {
      return {
        ...prevState,
        customerPhoneNumber: value,
      };
    });
  };

  const typesOfSlae = ["Cash", "Finance", "Wholesale", "Export"].map((s) => (
    <option key={s} value={s}>
      {s}
    </option>
  ));

  const soldBy = refferedBy?.map((p) => (
    <option key={p.representativeId} value={p.representativeId}>
      {p.representativeFirstName}
    </option>
  ));

  const costControlsChaneHandler = (
    event: ChangeEvent<HTMLInputElement>,
    controlName: string
  ) => {
    const value =
      event.target.value === "" ? undefined : parseInt(event.target.value);
    setValues((prevState) => {
      return { ...prevState, [controlName]: value };
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

  const colSpan1 = 6;

  return (
    <>
      <div className="d-flex flex-wrap justify-content-center p-3">
        <form onSubmit={handleSubmit}>
          <div className="d-flex gap-5">
            <div
              className="d-flex w-full flex-column gap-3 align-content-center"
              style={{ width: "28rem" }}
            >
              <div className="form-floating">
                <select
                  className="form-select"
                  id="typeOfSale"
                  name="typeOfSale"
                  aria-label="Floating label select example"
                  value={values.typeOfSale || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key="typeOfSale" value="">
                    Select Type Of Sale
                  </option>
                  {typesOfSlae}
                </select>
                <label htmlFor="typeOfSale">Sale Type</label>
                {errors?.typeOfSale && touched.typeOfSale && (
                  <p className="text-danger">{errors.typeOfSale}</p>
                )}
              </div>
              <div className="form-floating">
                <input
                  type="date"
                  className="form-control"
                  id="saleDate"
                  name="saleDate"
                  placeholder="Select date"
                  defaultValue={moment(values.saleDate || new Date()).format(
                    "YYYY-MM-DD"
                  )}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label htmlFor="saleDate">Sale Date</label>
              </div>
              <div className="form-floating">
                <select
                  className="form-select"
                  id="soldById"
                  name="soldById"
                  value={values.soldById || ""}
                  aria-label="Floating label select example"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option key="SelectsoldBy" value="">
                    Select Reffered by
                  </option>
                  {soldBy}
                </select>
                <label htmlFor="soldById">Reffered By</label>
                {errors?.soldById && touched.soldById && (
                  <p className="text-danger">{errors.soldById}</p>
                )}
              </div>
              <div className={`form-floating`}>
                <input
                  type="text"
                  className="form-control"
                  id="dealerFee"
                  name="dealerFee"
                  placeholder="Enter Amount"
                  defaultValue={values.dealerFee || undefined}
                  onChange={(e) => costControlsChaneHandler(e, "dealerFee")}
                  onBlur={handleBlur}
                />
                <label htmlFor="dealerFee">Dealer Fee</label>
              </div>
              <div className={`form-floating`}>
                <input
                  type="text"
                  className="form-control"
                  id="originalCost"
                  name="originalCost"
                  placeholder="Enter Amount"
                  defaultValue={values.originalCost || undefined}
                  onChange={(e) => costControlsChaneHandler(e, "originalCost")}
                  onBlur={handleBlur}
                />
                <label htmlFor="originalCost">Original Cost</label>
              </div>
              <div className={`form-floating`}>
                <input
                  type="text"
                  className="form-control"
                  id="salePrice"
                  name="salePrice"
                  placeholder="Enter Amount"
                  defaultValue={values.salePrice || undefined}
                  onChange={(e) => costControlsChaneHandler(e, "salePrice")}
                  onBlur={handleBlur}
                />
                <label htmlFor="salePrice">Sale Price</label>
                {errors?.salePrice && touched.salePrice && (
                  <p className="text-danger">{errors.salePrice}</p>
                )}
              </div>
              {values.salePrice && (
                <div className="mark p-2">
                  Total Sale Price: &nbsp;
                  <span style={{ color: "#5f95ed" }}>
                    {
                      calculateTotalSalePriceAndProfit()
                        ?.calCulatedTotalSalePrice
                    }
                  </span>
                </div>
              )}
              {values.originalCost && (
                <div className="mark p-2">
                  Total Orginal Cost:&nbsp;
                  <span style={{ color: "#5f95ed" }}>
                    $
                    {(
                      (values.originalCost! ?? 0) +
                      (values?.totalAddedCost! ?? 0) +
                      (values?.floorCost! ?? 0)
                    ).toFixed(2) || "0.00"}
                  </span>
                </div>
              )}
              {values.salePrice && (
                <div className="mark p-2">
                  Profit:&nbsp;
                  <span style={{ color: "#5f95ed" }}>
                    $ {calculateTotalSalePriceAndProfit()!.profit}
                  </span>
                </div>
              )}
            </div>
            <div
              className="d-flex flex-column gap-3"
              style={{ width: "28rem" }}
            >
              <SwitchRow>
                <SwitchCol>
                  <label htmlFor="isTitleScanned">Is Title Scanned</label>
                </SwitchCol>
                <SwitchCol colSpan={colSpan1}>
                  <div className="form-check form-switch text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isTitleScanned"
                      name="isTitleScanned"
                      checked={values.isTitleScanned === true}
                      value={values.isTitleScanned ? 1 : 0}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.isTitleScanned && touched.isTitleScanned && (
                      <p className="text-danger">{errors.isTitleScanned}</p>
                    )}
                  </div>
                </SwitchCol>
              </SwitchRow>
              <SwitchRow>
                <SwitchCol>
                  <label htmlFor="isContractScanned">Is Contract Scanned</label>
                </SwitchCol>
                <SwitchCol colSpan={colSpan1}>
                  <div className="d-flex form-check form-switch text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isContractScanned"
                      name="isContractScanned"
                      checked={values.isContractScanned === true}
                      value={values.isContractScanned ? 1 : 0}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.isContractScanned && touched.isContractScanned && (
                      <p className="text-danger">{errors.isContractScanned}</p>
                    )}
                  </div>
                </SwitchCol>
              </SwitchRow>
              <SwitchRow>
                <SwitchCol>
                  <label htmlFor="isAllExpensesAdded">
                    Is All Expenses Added
                  </label>
                </SwitchCol>
                <SwitchCol colSpan={colSpan1}>
                  <div className="form-check form-switch text-center">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isAllExpensesAdded"
                      name="isAllExpensesAdded"
                      checked={values.isAllExpensesAdded === true}
                      value={values.isAllExpensesAdded ? 1 : 0}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors?.isAllExpensesAdded &&
                      touched.isAllExpensesAdded && (
                        <p className="text-danger form-label">
                          {errors.isAllExpensesAdded}
                        </p>
                      )}
                  </div>
                </SwitchCol>
              </SwitchRow>
              <div className={`form-floating`}>
                <input
                  type="text"
                  className="form-control"
                  id="customerName"
                  name="customerName"
                  placeholder="Enter Customer Name"
                  defaultValue={values.customerName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label htmlFor="customerName">Customer Name</label>
                {errors?.customerName && touched.customerName && (
                  <p className="text-danger">{errors.customerName}</p>
                )}
              </div>
              <div className={`form-floating`}>
                <input
                  type="text"
                  className="form-control"
                  id="customerPhoneNumber"
                  name="customerPhoneNumber"
                  placeholder="Enter Customer Phone Number"
                  value={values.customerPhoneNumber || ""}
                  onChange={phoneNumberChangeHandler}
                  onBlur={handleBlur}
                />
                <label htmlFor="customerPhoneNumber">
                  Customer Phone Number
                </label>
                {errors?.customerPhoneNumber && touched.customerPhoneNumber && (
                  <p className="text-danger">{errors.customerPhoneNumber}</p>
                )}
              </div>

              <div className="d-flex justify-content-between mt-auto">
                <button
                  type="button"
                  className="btn btn-danger btn-hover"
                  onClick={() =>
                    dispatch(
                      updateisMarkAsSoldVisibleFlag({
                        isMarkAsSoldVisible: false,
                      })
                    )
                  }
                >
                  <IoCloseCircleSharp
                    size="20px"
                    color="#fff"
                    className="me-1"
                  />
                  Close
                </button>
                <button
                  type="submit"
                  className="ms-auto btn btn-primary btn-hover"
                >
                  <FaRegSave size="20px" color="#fff" className="me-2" />
                  Finalize Sale
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
