"use client";
import {
  useInventoryCUD,
  usePossibleKey,
  useRepresentative,
  useVehicleMake,
} from "@/hooks/useInventory";

import React, { ChangeEvent, useEffect, useState } from "react";
import {
  getVinData,
  getVehicleModelListByMakeName,
} from "@/actions/inventory-actions";
import { Inventory, VehicleModel } from "@/models/inventory";
import { useFormik, FormikHelpers } from "formik";
import { initialValues } from "./NewVehicleInitialValues";
import { newVehicleSchema } from "@/Schemas";
import { useStoreDispatch } from "@/app/store/hook";
import { updateModalCloseState } from "@/app/store/modal-slice";
import { toast } from "react-toastify";
import moment from "moment";
import { useUserData } from "@/hooks/useUserData";
import { GroupControl } from "../control-components/group-control";
import { RadioButtonGroupControl } from "../control-components/radio-btn-group-control";

type AddEditVehicleProps = {
  item?: Inventory;
  setItemUndefined?: () => void;
};

export default function AddEditVehicle({
  item,
  setItemUndefined,
}: AddEditVehicleProps) {
  const { userId } = useUserData();
  const { purchaseFrom, announcement, buyers } = useRepresentative();

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
      buyerId: buyers?.[0].representativeId,
    }),
    validationSchema: newVehicleSchema,
    onSubmit: (values, actions) => onSubmit(values, actions),
  });

  const [modalsList, setModalsList] = useState<VehicleModel[]>([]);

  const { keyNo, refetch } = usePossibleKey();
  const { makeList } = useVehicleMake();
  const { upsertInventory, isSuccess, data } = useInventoryCUD();

  const dispatch = useStoreDispatch();

  const purchaseFromData = purchaseFrom?.map((p) => (
    <option
      key={p.representativeId + p.representativeFirstName}
      value={p.representativeId}
    >
      {p.representativeFirstName}
    </option>
  ));

  const announcementData = announcement?.map((p) => (
    <option
      key={p.representativeId + p.representativeFirstName}
      value={p.representativeFirstName}
    >
      {p.representativeFirstName}
    </option>
  ));

  const vehicleMakes = makeList?.map((m) => (
    <option
      key={m.vehicleMakeId + m.vehicleMakeName}
      value={m.vehicleMakeName}
    />
  ));

  const buyersData = buyers?.map((p) => (
    <option key={p.representativeId} value={p.representativeId}>
      {p.representativeFirstName}
    </option>
  ));

  const vinChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 6) {
      const data = await getVinData(e.target.value);
      if (data) {
        setValues((prevState) => ({
          ...prevState,
          make: data.Make,
          model: data.Model,
          iYear: parseInt(data.ModelYear),
        }));
      }
    }
    handleChange(e);
  };

  const makeChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
    handleChange(e);
    if (e.target.value || values?.make) {
      const modals = await getVehicleModelListByMakeName(
        e.target.value || values?.make!
      );
      setModalsList(modals);
    }
  };

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

  const onSubmit = async (
    values: Inventory,
    actions: FormikHelpers<Inventory>
  ) => {
    //actions.resetForm();
    values.buyerId = values.buyerId ?? buyers?.[0].representativeId;
    if (values.inventoryId) {
      values.updatedById = userId;
    } else {
      values.createdById = userId;
    }
    console.log("Values", values);
    upsertInventory(values);
    if (isSuccess) {
      toast.success(data?.message);
      setItemUndefined!();
    }
  };

  useEffect(() => {
    if (item) {
      setValues(item);
    } else {
      refetch();
    }
  }, [item]);

  return (
    <>
      {isSuccess && (
        <div className="alert alert-success" role="alert">
          {data?.message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div
          className="d-flex gap-3 p-5 mb-2"
          style={{
            width: "80rem",
            maxHeight: "90vh",
            overflow: "auto",
            scrollBehavior: "smooth",
            textTransform: "uppercase",
            color: "darkblue",
          }}
        >
          <div id="controls" style={{ width: "35rem" }}>
            <GroupControl id="vin" label="VIN">
              <input
                type="text"
                className="form-control"
                id="vin"
                name="vin"
                defaultValue={values?.vin}
                onChange={vinChangeHandler}
                placeholder="Enter a Vin"
              />
              {errors?.vin && touched.vin && (
                <p className="text-danger">{errors.vin}</p>
              )}
            </GroupControl>
            <GroupControl id="make" label="MAKE">
              <input
                type="text"
                className="form-control "
                id="make"
                name="make"
                list="make-list"
                placeholder="Enter a make"
                value={values?.make || ""}
                onChange={makeChangeHandler}
                onBlur={handleBlur}
              />
              {errors?.make && touched.make && (
                <p className="text-danger">{errors.make}</p>
              )}
            </GroupControl>
            <GroupControl id="model" label="MODEL">
              <input
                type="text"
                className="form-control "
                id="model"
                name="model"
                list="modal-list"
                value={values?.model || ""}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter a model"
              />
              {errors?.model && touched.model && (
                <p className="text-danger">{errors.model}</p>
              )}
            </GroupControl>
            <GroupControl id="iYear" label="YEAR">
              <input
                type="text"
                className="form-control "
                id="iYear"
                name="iYear"
                value={values?.iYear! || ""}
                onChange={(e) => costControlsChaneHandler(e, "iYear")}
                onBlur={handleBlur}
                placeholder="Enter a year"
              />
              {errors?.iYear && touched.iYear && (
                <p className="text-danger">{errors.iYear}</p>
              )}
            </GroupControl>
            <GroupControl id="color" label="COLOR">
              <input
                type="text"
                className="form-control "
                id="color"
                name="color"
                defaultValue={values?.color! || undefined}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter a color"
              />
              {errors?.color && touched.color && (
                <p className="text-danger">{errors.color}</p>
              )}
            </GroupControl>

            <GroupControl id="numberOfKeys" label="NUMBER OF KEYS">
              <input
                type="text"
                className="form-control "
                id="numberOfKeys"
                name="numberOfKeys"
                defaultValue={values?.numberOfKeys! || undefined}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter a number of keys"
              />
              {errors?.numberOfKeys && touched.numberOfKeys && (
                <p className="text-danger">{errors.numberOfKeys}</p>
              )}
            </GroupControl>
            <GroupControl id="purchaseDate" label="PURCHASE DATE">
              <input
                type="date"
                className="form-control "
                id="purchaseDate"
                name="purchaseDate"
                value={
                  moment(values?.purchaseDate).format("YYYY-MM-DD") || undefined
                }
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Select purchase date"
              />
              {errors?.purchaseDate && touched.purchaseDate && (
                <p className="text-danger">{errors.purchaseDate}</p>
              )}
            </GroupControl>
            <GroupControl id="purchaseFromId" label="PURCHASE FROM">
              <select
                className="form-select"
                id="purchaseFromId"
                name="purchaseFromId"
                aria-label="Floating label select example"
                defaultValue={values?.purchaseFrom! || undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option key="selected" value="">
                  Select purchase from
                </option>
                {purchaseFromData}
              </select>
              {errors?.purchaseFromId && touched.purchaseFrom && (
                <p className="text-danger">{errors.purchaseFromId}</p>
              )}
            </GroupControl>
            <GroupControl id="floorCost" label="FLOOR COST">
              <input
                type="number"
                className="form-control "
                id="floorCost"
                name="floorCost"
                defaultValue={
                  values?.floorCost! || typeof values.floorCost === "string"
                    ? undefined
                    : values.floorCost
                }
                onChange={(e) => costControlsChaneHandler(e, "floorCost")}
                onBlur={handleBlur}
                placeholder="Enter a floor cost"
              />
              {errors?.floorCost && touched.floorCost && (
                <p className="text-danger">{errors.floorCost}</p>
              )}
            </GroupControl>
            <GroupControl id="originalCost" label="ORIGINAL COST">
              <input
                type="number"
                className="form-control"
                id="originalCost"
                name="originalCost"
                placeholder="Enter a original cost"
                defaultValue={values?.originalCost! || undefined}
                onChange={(e) => costControlsChaneHandler(e, "originalCost")}
                onBlur={handleBlur}
              />
              {errors?.originalCost && touched.originalCost && (
                <p className="text-danger">{errors.originalCost}</p>
              )}
            </GroupControl>
            <GroupControl id="buyerId" label="SELECT BUYER">
              <select
                className="form-select"
                id="buyerId"
                name="buyerId"
                defaultValue={values?.buyerId! || undefined}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-label="Floating label select example"
              >
                {buyersData}
              </select>
              {errors?.buyerId && touched.buyerId && (
                <p className="text-danger">{errors.buyerId}</p>
              )}
            </GroupControl>
            <GroupControl id="announcement" label="ANNOUNCEMENT">
              <select
                className="form-select"
                id="announcement"
                name="announcement"
                aria-label="Floating label select example"
                defaultValue={values?.announcement! || undefined}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option value="">Select a announcement</option>
                {announcementData}
              </select>
              {errors?.buyerId && touched.buyerId && (
                <p className="text-danger">{errors.buyerId}</p>
              )}
            </GroupControl>
          </div>
          <div
            id="conditionCheck"
            className="d-flex flex-column"
            style={{ width: "40rem" }}
          >
            <RadioButtonGroupControl
              id="battery"
              label="BATTERY"
              checkedValue={values.battery || ""}
              onChange={handleChange}
              options={["Good", "Bad", "Low"]}
            >
              {errors?.battery && touched.battery && (
                <p className="text-danger">{errors.battery}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="checkEngineLight"
              label="CHECK ENGINE LIGHT"
              checkedValue={values.checkEngineLight || ""}
              onChange={handleChange}
              options={["Off", "On"]}
            >
              {errors?.checkEngineLight && touched.checkEngineLight && (
                <p className="text-danger">{errors.checkEngineLight}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="ac"
              label="A/C"
              checkedValue={values.ac || ""}
              onChange={handleChange}
              options={["Good", "Need Work"]}
            >
              {errors?.ac && touched.ac && (
                <p className="text-danger">{errors.ac}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="windows"
              label="WINDOWS"
              onChange={handleChange}
              checkedValue={values.windows || ""}
              options={["All Work", "Need Work"]}
            >
              {errors?.windows && touched.windows && (
                <p className="text-danger">{errors.windows}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="tireLight"
              label="Tire light"
              onChange={handleChange}
              checkedValue={values.tireLight || ""}
              options={["Off", "Need Work"]}
            >
              {errors?.tireLight && touched.tireLight && (
                <p className="text-danger">{errors.tireLight}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="radio"
              label="Radio"
              checkedValue={values.radio || ""}
              onChange={handleChange}
              options={["Good", "Need Work"]}
            >
              {errors?.radio && touched.radio && (
                <p className="text-danger">{errors.radio}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="windsheild"
              label="Windshield"
              onChange={handleChange}
              checkedValue={values.windsheild || ""}
              options={["Good", "Replacement Required", "Cracked"]}
            >
              {errors?.radio && touched.radio && (
                <p className="text-danger">{errors.radio}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="sunroof"
              label="Sunroof"
              onChange={handleChange}
              checkedValue={values.sunroof || ""}
              options={["Works Fine", "Need Work", "No Sun Roof"]}
            >
              {errors?.sunroof && touched.sunroof && (
                <p className="text-danger">{errors.sunroof}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="upholstrey"
              label="Upholstery"
              onChange={handleChange}
              checkedValue={values.upholstrey || ""}
              options={["All Good", "Seats", "Headliner"]}
            >
              {errors?.upholstrey && touched.upholstrey && (
                <p className="text-danger">{errors.upholstrey}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="cleanliness"
              label="Cleanliness"
              onChange={handleChange}
              checkedValue={values.cleanliness || ""}
              options={["Clean", "Need Work"]}
            >
              {errors?.cleanliness && touched.cleanliness && (
                <p className="text-danger">{errors.cleanliness}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="bodyWork"
              label="Body work"
              onChange={handleChange}
              checkedValue={values.bodyWork || ""}
              options={["No", "Yes"]}
            >
              {errors?.bodyWork && touched.bodyWork && (
                <p className="text-danger">{errors.bodyWork}</p>
              )}
            </RadioButtonGroupControl>
            <RadioButtonGroupControl
              id="others"
              label="Others"
              onChange={handleChange}
              checkedValue={values.others || ""}
              options={["No", "Yes"]}
            >
              {errors?.others && touched.others && (
                <p className="text-danger">{errors.others}</p>
              )}
            </RadioButtonGroupControl>
            <div className="mb-3">
              <div className="form-floating p-2 mt-4">
                <input
                  type="text"
                  className="form-control "
                  id="amythingMike"
                  name="amythingMike"
                  placeholder="Any lights or messages on the dash"
                  value={values?.amythingMike || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <label htmlFor="amythingMike">
                  Any lights or messages on the dash
                </label>
              </div>
              {errors?.amythingMike && (
                <p className="text-danger">{errors.amythingMike}</p>
              )}
            </div>
            <div className="row g-3 pe-3">
              <div className="col-6 ps-3">
                <button
                  type="button"
                  onClick={() => {
                    setItemUndefined!();
                    dispatch(updateModalCloseState({ modalVisible: false }));
                  }}
                  className="btn btn-outline-danger btn-hover me-2"
                >
                  Close
                </button>
                <button type="button" className="btn btn-info ">
                  Upload
                </button>
              </div>
              <div className="col-6 text-end pe-3">
                <button type="submit" className="ms-auto btn btn-primary">
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
