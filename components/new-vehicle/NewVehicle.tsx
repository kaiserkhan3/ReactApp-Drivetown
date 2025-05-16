"use client";
import {
  useInventoryCUD,
  usePossibleKey,
  useRepresentative,
  useVehicleMake,
} from "@/hooks/useInventory";
import FlexItem from "../control-components/FlexItem";
import classes from "./new-vehicle.module.css";
import FlextContainerMB from "../control-components/FlexContainerWithMarginBottom";
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

type NewVhicleProps = {
  item?: Inventory;
};

export default function NewVehicle({ item }: NewVhicleProps) {
  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<Inventory>({
    initialValues,
    validationSchema: newVehicleSchema,
    onSubmit: (values, actions) => onSubmit(values, actions),
  });

  const [modalsList, setModalsList] = useState<VehicleModel[]>([]);
  const { purchaseFrom, announcement, buyers } = useRepresentative();
  const { keyNo, refetch } = usePossibleKey();
  const { makeList } = useVehicleMake();
  const { upsertInventory } = useInventoryCUD();

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
    handleChange(e);
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

  const onSubmit = (values: Inventory, actions: FormikHelpers<Inventory>) => {
    //actions.resetForm();
    upsertInventory(values);
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
      <form onSubmit={handleSubmit}>
        <div
          className={classes.flexContainer}
          style={{ textTransform: "uppercase" }}
        >
          <div
            className={`${classes.flexItem} ${classes.color} ${classes.spacing}`}
          >
            <div className="pt-2 ps-2">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="vin"
                  name="vin"
                  value={values?.vin}
                  onChange={vinChangeHandler}
                  placeholder="Enter a Vin"
                />
                <label htmlFor="vin">VIN</label>
              </div>
              {errors?.vin && touched.vin && (
                <p className="text-danger">{errors.vin}</p>
              )}
            </div>
            <div className={`pt-1 ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className={`form-floating `}>
                  <input
                    type="text"
                    className="form-control"
                    id="make"
                    name="make"
                    list="make-list"
                    placeholder="Enter a make"
                    value={values?.make || ""}
                    onChange={makeChangeHandler}
                    onBlur={handleBlur}
                  />
                  <datalist id="make-list">{vehicleMakes}</datalist>
                  <label htmlFor="make">MAKE</label>
                </div>
                {errors?.make && touched.make && (
                  <p className="text-danger">{errors.make}</p>
                )}
              </FlexItem>
              <FlexItem>
                <div className={`form-floating`}>
                  <input
                    type="text"
                    className="form-control"
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
                  <label htmlFor="model">MODEL</label>
                </div>
                {errors?.model && touched.model && (
                  <p className="text-danger">{errors.model}</p>
                )}
              </FlexItem>
            </div>
            <div className={`ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className={`form-floating`}>
                  <input
                    type="text"
                    className="form-control"
                    id="iYear"
                    name="iYear"
                    value={values?.iYear! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a year"
                  />
                  <label htmlFor="iYear">YEAR</label>
                </div>
                {errors?.iYear && touched.iYear && (
                  <p className="text-danger">{errors.iYear}</p>
                )}
              </FlexItem>
              <FlexItem>
                <div className={`form-floating`}>
                  <input
                    type="text"
                    className="form-control"
                    id="color"
                    name="color"
                    value={values?.color! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a color"
                  />
                  <label htmlFor="color">COLOR</label>
                </div>
                {errors?.color && touched.color && (
                  <p className="text-danger">{errors.color}</p>
                )}
              </FlexItem>
            </div>
            <div className={`ps-2 mb-2  ${classes.flexContainer}`}>
              <FlexItem>
                <div className={`form-floating`}>
                  <input
                    type="text"
                    className="form-control"
                    id="keyNo"
                    name="keyNo"
                    value={values?.keyNo! || keyNo || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a year"
                  />
                  <label htmlFor="keyNo">KEY NUMBER</label>
                </div>
                {errors?.keyNo && touched.keyNo && (
                  <p className="text-danger">{errors.keyNo}</p>
                )}
              </FlexItem>
              <FlexItem>
                <div className={`form-floating`}>
                  <input
                    type="text"
                    className="form-control"
                    id="numberOfKeys"
                    name="numberOfKeys"
                    value={values?.numberOfKeys! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a color"
                  />
                  <label htmlFor="numberOfKeys">NUMBER OF KEYS</label>
                </div>
                {errors?.numberOfKeys && touched.numberOfKeys && (
                  <p className="text-danger">{errors.numberOfKeys}</p>
                )}
              </FlexItem>
            </div>
            <div className={`ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className="form-floating">
                  <input
                    type="date"
                    className="form-control"
                    id="purchaseDate"
                    name="purchaseDate"
                    value={values?.purchaseDate!.toString()}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Select purchase date"
                  />
                  <label htmlFor="purchaseDate">PURCHASE DATE</label>
                </div>
                {errors?.purchaseDate && touched.purchaseDate && (
                  <p className="text-danger">{errors.purchaseDate}</p>
                )}
              </FlexItem>
            </div>
            <div className={` ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="purchaseFromId"
                    name="purchaseFromId"
                    aria-label="Floating label select example"
                    value={values?.purchaseFrom! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option key="selected" value="">
                      Select purchase from
                    </option>
                    {purchaseFromData}
                  </select>
                  <label htmlFor="purchaseFromId">PURCHASE FROM</label>
                </div>
                {errors?.purchaseFromId && touched.purchaseFrom && (
                  <p className="text-danger">{errors.purchaseFromId}</p>
                )}
              </FlexItem>
            </div>
            <div className={` ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className="form-floating">
                  <input
                    type="number"
                    className="form-control"
                    id="originalCost"
                    name="originalCost"
                    placeholder="Enter a original cost"
                    value={values?.originalCost! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <label htmlFor="originalCost">ORIGINAL COST</label>
                </div>
                {errors?.originalCost && touched.originalCost && (
                  <p className="text-danger">{errors.originalCost}</p>
                )}
              </FlexItem>
            </div>
            <div className={` ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className="form-floating ">
                  <input
                    type="number"
                    className="form-control"
                    id="floorCost"
                    name="floorCost"
                    value={values?.floorCost! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter a floor cost"
                  />
                  <label htmlFor="floorCost">FLOOR COST</label>
                </div>
                {errors?.floorCost && touched.floorCost && (
                  <p className="text-danger">{errors.floorCost}</p>
                )}
              </FlexItem>
            </div>
            <div className={` ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="buyerId"
                    name="buyerId"
                    value={values?.buyerId! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    aria-label="Floating label select example"
                  >
                    <option key="selectBuyer" value="">
                      Select buyer
                    </option>
                    {buyersData}
                  </select>
                  <label htmlFor="buyerId">SELECT BUYER</label>
                </div>
                {errors?.buyerId && touched.buyerId && (
                  <p className="text-danger">{errors.buyerId}</p>
                )}
              </FlexItem>
            </div>
            <div className={` ps-2 mb-2 ${classes.flexContainer}`}>
              <FlexItem>
                <div className="form-floating">
                  <select
                    className="form-select"
                    id="announcement"
                    name="announcement"
                    aria-label="Floating label select example"
                    value={values?.announcement! || ""}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Select a announcement</option>
                    {announcementData}
                  </select>
                  <label htmlFor="announcement">ANNOUNCEMENT</label>
                </div>
                {errors?.announcement && touched.announcement && (
                  <p className="text-danger">{errors.announcement}</p>
                )}
              </FlexItem>
            </div>
          </div>
          <div
            className={`${classes.flexItem} ${classes.color} ${classes.spacing}`}
          >
            <FlextContainerMB>
              <FlexItem>
                <label className="form-label" htmlFor="batteryGood">
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
              </FlexItem>
              <FlexItem>
                <label className="form-label" htmlFor="checkEngineLightOff">
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
              </FlexItem>
            </FlextContainerMB>
            <FlextContainerMB>
              <FlexItem>
                <label className="form-label" htmlFor="acGood">
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
              </FlexItem>
              <FlexItem>
                <label className="form-label" htmlFor="windowsAllWork">
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
              </FlexItem>
            </FlextContainerMB>
            <FlextContainerMB>
              <FlexItem>
                <label className="form-label" htmlFor="tireLightOff">
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
                    <label className="form-check-label" htmlFor="tireLightOff">
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
              </FlexItem>
              <FlexItem>
                <label className="form-label" htmlFor="radioGood">
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
                    <label className="form-check-label" htmlFor="radioNeedWork">
                      NEED WORK
                    </label>
                  </div>
                </div>
                {errors?.radio && touched.radio && (
                  <p className="text-danger">{errors.radio}</p>
                )}
              </FlexItem>
            </FlextContainerMB>
            <FlextContainerMB>
              <FlexItem>
                <label className="form-label" htmlFor="windsheildGood">
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
                    <label className="form-check-label" htmlFor="windsheildRR">
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
              </FlexItem>
              <FlexItem>
                <label className="form-label" htmlFor="sunroofwf">
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
              </FlexItem>
            </FlextContainerMB>
            <FlextContainerMB>
              <FlexItem>
                <label className="form-label" htmlFor="upholstreyAG">
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
                    <label className="form-check-label" htmlFor="upholstreyAG">
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
              </FlexItem>
              <FlexItem>
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
                    <label className="form-check-label" htmlFor="cleanlinessC">
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
                    <label className="form-check-label" htmlFor="cleanlinessNW">
                      Need Work
                    </label>
                  </div>
                </div>
                {errors?.cleanliness && touched.cleanliness && (
                  <p className="text-danger">{errors.cleanliness}</p>
                )}
              </FlexItem>
            </FlextContainerMB>
            <FlextContainerMB>
              <FlexItem>
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
              </FlexItem>
              <FlexItem>
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
              </FlexItem>
            </FlextContainerMB>
            <FlextContainerMB>
              <FlexItem>
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
              </FlexItem>
            </FlextContainerMB>
            <FlextContainerMB>
              <button
                type="button"
                onClick={() =>
                  dispatch(updateModalCloseState({ modalVisible: false }))
                }
                className="btn btn-secondary"
              >
                Close
              </button>
              <button type="button" className="btn btn-info">
                Upload
              </button>
              <button type="submit" className="ms-auto btn btn-primary">
                Save
              </button>
            </FlextContainerMB>
          </div>
        </div>
      </form>
    </>
  );
}
