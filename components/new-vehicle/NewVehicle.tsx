"use client";
import styles from "./NewVehicle.module.css";
import {
  useInventoryCUD,
  usePossibleKey,
  useRepresentative,
  useVehicleMake,
} from "@/hooks/useInventory";

import { ChangeEvent, useEffect, useState } from "react";
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

type NewVhicleProps = {
  item?: Inventory;
};

export default function NewVehicle({ item }: NewVhicleProps) {
  const { userId } = useUserData();
  const { purchaseFrom, announcement, buyers } = useRepresentative();

  const {
    values,
    setValues,
    setFieldValue,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<Inventory>({
    initialValues: {
      ...initialValues,
      buyerId: buyers?.[0]?.representativeId,
    },
    enableReinitialize: true,
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
        setFieldValue("make", data.Make);
        setFieldValue("model", data.Model);
        setFieldValue("iYear", parseInt(data.ModelYear));
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
    setFieldValue(controlName, value);
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

    upsertInventory(values);
    if (isSuccess) {
      toast.success(data?.message);
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
        <div className={`${styles.container} shadow-lg`}>
          <div className={styles.formRow}>
            <div className={styles.leftCol}>
              <div className="row g-2">
                <div
                  className={`col-12 form-floating pe-3 ${styles.formFloating}`}
                >
                  <input
                    type="text"
                    className={`form-control ${styles.formControl}`}
                    id="vin"
                    name="vin"
                    value={values?.vin || ""}
                    onChange={vinChangeHandler}
                    placeholder="Enter a Vin"
                  />
                  <label className={styles.formLabel} htmlFor="vin">
                    VIN
                  </label>
                  {errors?.vin && touched.vin && (
                    <p className={styles.note}>{errors.vin}</p>
                  )}
                </div>
                <div
                  className={`col-6 form-floating pe-3 ${styles.formFloating}`}
                >
                  <input
                    type="text"
                    className={`form-control ${styles.formControl}`}
                    id="make"
                    name="make"
                    list="make-list"
                    placeholder="Enter a make"
                    value={values?.make || ""}
                    onChange={makeChangeHandler}
                    onBlur={handleBlur}
                  />
                  <datalist id="make-list">{vehicleMakes}</datalist>
                  <label className={styles.formLabel} htmlFor="make">
                    MAKE
                  </label>
                  {errors?.make && touched.make && (
                    <p className={styles.note}>{errors.make}</p>
                  )}
                </div>
                <div
                  className={`col-6 form-floating pe-3 ${styles.formFloating}`}
                >
                  <input
                    type="text"
                    className={`form-control ${styles.formControl}`}
                    id="model"
                    name="model"
                    list="modal-list"
                    value={values?.model || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a model"
                  />
                  <datalist id="modal-list">
                    {modalsList?.map((m, index) => (
                      <option
                        key={m.vehicleModelName + index}
                        value={m.vehicleModelName}
                      />
                    ))}
                  </datalist>
                  <label className={styles.formLabel} htmlFor="model">
                    MODEL
                  </label>
                  {errors?.model && touched.model && (
                    <p className={styles.note}>{errors.model}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <input
                    type="text"
                    className="form-control"
                    id="iYear"
                    name="iYear"
                    value={values?.iYear! || ""}
                    onChange={(e) => costControlsChaneHandler(e, "iYear")}
                    onBlur={handleBlur}
                    placeholder="Enter a year"
                  />
                  <label htmlFor="iYear">YEAR</label>
                  {errors?.iYear && touched.iYear && (
                    <p className="text-danger">{errors.iYear}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    name="color"
                    value={values?.color || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a color"
                  />
                  <label htmlFor="color">COLOR</label>
                  {errors?.color && touched.color && (
                    <p className="text-danger">{errors.color}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <input
                    type="text"
                    className="form-control"
                    id="keyNo"
                    name="keyNo"
                    value={values?.keyNo ?? keyNo ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a year"
                  />
                  <label htmlFor="keyNo">KEY NUMBER</label>
                  {errors?.keyNo && touched.keyNo && (
                    <p className="text-danger">{errors.keyNo}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <input
                    type="text"
                    className="form-control"
                    id="numberOfKeys"
                    name="numberOfKeys"
                    value={values?.numberOfKeys || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a color"
                  />
                  <label htmlFor="numberOfKeys">NUMBER OF KEYS</label>
                  {errors?.numberOfKeys && touched.numberOfKeys && (
                    <p className="text-danger">{errors.numberOfKeys}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <input
                    type="date"
                    className="form-control"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={
                      values?.purchaseDate
                        ? moment(values.purchaseDate).format("YYYY-MM-DD")
                        : ""
                    }
                    onChange={(e) =>
                      setFieldValue("purchaseDate", new Date(e.target.value))
                    }
                    onBlur={handleBlur}
                    placeholder="Select purchase date"
                  />
                  <label htmlFor="purchaseDate">PURCHASE DATE</label>
                  {errors?.purchaseDate && touched.purchaseDate && (
                    <p className="text-danger">{errors.purchaseDate}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <select
                    className="form-select"
                    id="purchaseFromId"
                    name="purchaseFromId"
                    aria-label="Floating label select example"
                    value={values?.purchaseFromId ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option key="selected" value="">
                      Select purchase from
                    </option>
                    {purchaseFromData}
                  </select>
                  <label htmlFor="purchaseFromId">PURCHASE FROM</label>
                  {errors?.purchaseFromId && touched.purchaseFrom && (
                    <p className="text-danger">{errors.purchaseFromId}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <input
                    type="number"
                    className="form-control"
                    id="floorCost"
                    name="floorCost"
                    value={values?.floorCost ?? ""}
                    onChange={(e) => costControlsChaneHandler(e, "floorCost")}
                    onBlur={handleBlur}
                    placeholder="Enter a floor cost"
                  />
                  <label htmlFor="floorCost">FLOOR COST</label>
                  {errors?.floorCost && touched.floorCost && (
                    <p className="text-danger">{errors.floorCost}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <input
                    type="number"
                    className="form-control"
                    id="originalCost"
                    name="originalCost"
                    placeholder="Enter a original cost"
                    value={values?.originalCost ?? ""}
                    onChange={(e) =>
                      costControlsChaneHandler(e, "originalCost")
                    }
                    onBlur={handleBlur}
                  />
                  <label htmlFor="originalCost">ORIGINAL COST</label>
                  {errors?.originalCost && touched.originalCost && (
                    <p className="text-danger">{errors.originalCost}</p>
                  )}
                </div>
                <div className="col-6 form-floating pe-3">
                  <select
                    className="form-select"
                    id="buyerId"
                    name="buyerId"
                    value={values?.buyerId ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-label="Floating label select example"
                  >
                    {buyersData}
                  </select>
                  <label htmlFor="buyerId">SELECT BUYER</label>
                  {errors?.buyerId && touched.buyerId && (
                    <p className="text-danger">{errors.buyerId}</p>
                  )}
                </div>
                <div className="col-12 form-floating pe-3">
                  <select
                    className="form-select"
                    id="announcement"
                    name="announcement"
                    aria-label="Floating label select example"
                    value={values?.announcement ?? ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select a announcement</option>
                    {announcementData}
                  </select>
                  <label htmlFor="announcement">ANNOUNCEMENT</label>
                  {errors?.announcement && touched.announcement && (
                    <p className="text-danger">{errors.announcement}</p>
                  )}
                </div>
              </div>
            </div>
            <div className={styles.rightCol}>
              <div className="row g-2">
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="battery">
                    BATTERY
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="battery"
                        id="batteryGood"
                        value="Good"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values?.battery === "Good"}
                      />
                      <label className="form-check-label" htmlFor="batteryGood">
                        GOOD
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="battery"
                        id="batteryBad"
                        value="Bad"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values?.battery === "Bad"}
                      />
                      <label className="form-check-label" htmlFor="batteryBad">
                        BAD
                      </label>
                    </div>
                  </div>
                  {errors?.battery && touched.battery && (
                    <p className="text-danger">{errors.battery}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="checkEngineLight">
                    CHECK ENGINE LIGHT
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="checkEngineLight"
                        id="checkEngineLightOff"
                        value="Off"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values?.checkEngineLight === "Off"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="checkEngineLightOff"
                      >
                        OFF
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="checkEngineLight"
                        id="checkEngineLightOn"
                        value="On"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values?.checkEngineLight === "On"}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="checkEngineLightOn"
                      >
                        ON
                      </label>
                    </div>
                  </div>
                  {errors?.checkEngineLight && touched.checkEngineLight && (
                    <p className="text-danger">{errors.checkEngineLight}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="ac">
                    A/C
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ac"
                        id="acGood"
                        value="Good"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values?.ac === "Good"}
                      />
                      <label className="form-check-label" htmlFor="acGood">
                        GOOD
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="ac"
                        id="acNeedWork"
                        value="Need Work"
                        checked={values?.ac === "Need Work"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="acNeedWork">
                        NEED WORK
                      </label>
                    </div>
                  </div>
                  {errors?.ac && touched.ac && (
                    <p className="text-danger">{errors.ac}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="windows">
                    WINDOWS
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="windows"
                        id="windowsAllWork"
                        value="All Work"
                        checked={values?.windows === "All Work"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="windowsAllWork"
                      >
                        ALL WORK
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="windows"
                        id="windowsNeedwork"
                        value="Need Work"
                        checked={values?.windows === "Need Work"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="windowsNeedwork"
                      >
                        NEED WORK
                      </label>
                    </div>
                  </div>
                  {errors?.windows && touched.windows && (
                    <p className="text-danger">{errors.windows}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="tireLight">
                    Tire light
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tireLight"
                        id="tireLightOff"
                        value="Off"
                        checked={values?.tireLight === "Off"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="tireLightOff"
                      >
                        off
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="tireLight"
                        id="tireLightNeedwork"
                        value="Need Work"
                        checked={values?.tireLight === "Need Work"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="tireLightNeedwork"
                      >
                        On
                      </label>
                    </div>
                  </div>
                  {errors?.tireLight && touched.tireLight && (
                    <p className="text-danger">{errors.tireLight}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="radio">
                    Radio
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="radio"
                        id="radioGood"
                        value="Good"
                        checked={values?.radio === "Good"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="radioGood">
                        Good
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="radio"
                        id="radioNeedWork"
                        value="Need Work"
                        checked={values?.radio === "Need Work"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="radioNeedWork"
                      >
                        NEED WORK
                      </label>
                    </div>
                  </div>
                  {errors?.radio && touched.radio && (
                    <p className="text-danger">{errors.radio}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="windsheild">
                    Windshield
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="windsheild"
                        id="windsheildGood"
                        value="Good"
                        checked={values?.windsheild === "Good"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="windsheildGood"
                      >
                        Good
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="windsheild"
                        id="windsheildRR"
                        value="Replacement Required"
                        checked={values?.windsheild === "Replacement Required"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="windsheildRR"
                      >
                        Replacement Required
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="windsheild"
                        id="cracked"
                        value="Cracked"
                        checked={values?.windsheild === "Cracked"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="cracked">
                        Cracked
                      </label>
                    </div>
                  </div>
                  {errors?.radio && touched.radio && (
                    <p className="text-danger">{errors.radio}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="sunsunroofoofwf">
                    Sunroof
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sunroof"
                        id="sunroofwf"
                        value="Works Fine"
                        checked={values?.sunroof === "Works Fine"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="sunroofwf">
                        Works Fine
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sunroof"
                        id="sunroofnd"
                        value="Need Work"
                        checked={values?.sunroof === "Need Work"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="sunroofnd">
                        NEED WORK
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="sunroof"
                        checked={values?.sunroof === "No Sun Roof"}
                        id="sunroofnsr"
                        value="No Sun Roof"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="sunroofnsr">
                        No Sun Roof
                      </label>
                    </div>
                  </div>
                  {errors?.sunroof && touched.sunroof && (
                    <p className="text-danger">{errors.sunroof}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="upholstrey">
                    Upholstery
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="upholstrey"
                        id="upholstreyAG"
                        checked={values?.upholstrey === "All Good"}
                        value="All Good"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="upholstreyAG"
                      >
                        All Good
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="upholstrey"
                        id="upholstreyS"
                        checked={values?.upholstrey === "Seats"}
                        value="Seats"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="upholstreyS">
                        Seats
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="upholstrey"
                        id="upholstreyH"
                        checked={values?.upholstrey === "Headliner"}
                        value="Headliner"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="upholstreyH">
                        Headliner
                      </label>
                    </div>
                  </div>
                  {errors?.upholstrey && touched.upholstrey && (
                    <p className="text-danger">{errors.upholstrey}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="cleanlinessC">
                    Cleanliness
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="cleanliness"
                        id="cleanlinessC"
                        checked={values?.cleanliness === "Clean"}
                        value="Clean"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="cleanlinessC"
                      >
                        Clean
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="cleanliness"
                        id="cleanlinessNW"
                        checked={values?.cleanliness === "Need Work"}
                        value="Need Work"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label
                        className="form-check-label"
                        htmlFor="cleanlinessNW"
                      >
                        Need Work
                      </label>
                    </div>
                  </div>
                  {errors?.cleanliness && touched.cleanliness && (
                    <p className="text-danger">{errors.cleanliness}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="bodyWorkYes">
                    Body work
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="bodyWork"
                        id="bodyWorkYes"
                        value="Yes"
                        checked={values?.bodyWork === "Yes"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="bodyWorkYes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="bodyWork"
                        id="bodyWorkNo"
                        value="No"
                        checked={values?.bodyWork === "No"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="bodyWorkNo">
                        No
                      </label>
                    </div>
                  </div>
                  {errors?.bodyWork && touched.bodyWork && (
                    <p className="text-danger">{errors.bodyWork}</p>
                  )}
                </div>
                <div className="col-6 pe-3">
                  <label className="form-label" htmlFor="othersYes">
                    Others
                  </label>
                  <div className="ms-3">
                    <div className="form-check  form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="others"
                        id="othersYes"
                        value="Yes"
                        checked={values?.others === "Yes"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="othersYes">
                        Yes
                      </label>
                    </div>
                    <div className="form-check form-check-inline">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="others"
                        id="othersNo"
                        value="No"
                        checked={values?.others === "No"}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <label className="form-check-label" htmlFor="othersNo">
                        No
                      </label>
                    </div>
                  </div>
                  {errors?.others && touched.others && (
                    <p className="text-danger">{errors.others}</p>
                  )}
                </div>
                <div className="col-12 pe-3">
                  <div className="form-floating p-2 mt-4">
                    <input
                      type="text"
                      className="form-control"
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
                      onClick={() =>
                        dispatch(updateModalCloseState({ modalVisible: false }))
                      }
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
          </div>
        </div>
      </form>
    </>
  );
}
