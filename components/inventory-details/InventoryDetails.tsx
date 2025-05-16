"use client";
import React, { ChangeEvent, useEffect } from "react";

import { useGetInventoryById, useInventoryCUD } from "@/hooks/useInventory";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";

import { Inventory } from "@/models/inventory";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "react-toastify";
import VehicleInfo from "./VehicleInfo";
import VehicleOngoingDetails from "./VehicleOngoingDetails";
import VehicleCostDetails from "./VehicleCostDetails";

type InventoryDetailsProps = {
  inventoryId?: number;
};

export default function InventoryDetails({
  inventoryId,
}: InventoryDetailsProps) {
  const { invData, isFetching, isError, error, refetch } = useGetInventoryById(
    inventoryId!
  );

  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<Inventory>({
    initialValues: invData || ({} as Inventory),
    enableReinitialize: true,
    onSubmit: (values, actions) => submitHandler(values, actions),
  });

  console.log({ values });

  const { upsertInventory, isSuccess, isPending, status } = useInventoryCUD();

  if (isFetching) {
    return <ThreeDotLoader />;
  }

  const switchHandler = (
    event: ChangeEvent<HTMLInputElement>,
    controlName: string
  ) => {
    handleChange(event);
    setValues((prevState) => {
      return { ...prevState, [controlName]: event.target.checked };
    });
    handleSubmit();
  };
  const titleSwitchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const value = event.target.checked ? "Here" : "Not Here";
    setValues((prevState) => {
      return { ...prevState, title: value };
    });
    handleSubmit();
  };

  const submitHandler = (
    values: Inventory,
    actions: FormikHelpers<Inventory>
  ) => {
    upsertInventory(values);
    toast.success("Changes are updated successfully!!");
  };

  if (isError) {
    toast.error("Something went wrong, Please reach out to admin team");
  }

  return (
    <>
      <div className="container-fluid">
        <form onSubmit={handleSubmit}>
          <div className="d-flex gap-3 mt-2">
            {values && (
              <>
                <VehicleInfo row={values} />
                <VehicleOngoingDetails
                  handleSubmit={handleSubmit}
                  switchHandler={switchHandler}
                  titleSwitchHandler={titleSwitchHandler}
                  values={values}
                />
                <VehicleCostDetails
                  inventoryId={inventoryId!}
                  handleSubmit={handleSubmit}
                  values={values}
                  handleChange={handleChange}
                />
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}
