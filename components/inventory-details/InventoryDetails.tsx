"use client";
import React, { ChangeEvent, Suspense, useState } from "react";

import {
  useGetInventoryById,
  useGetVechileUpdates,
  useInventoryCUD,
  useRepresentative,
} from "@/hooks/useInventory";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";

import { documentType, imageType, Inventory } from "@/models/inventory";
import { FormikHelpers, useFormik } from "formik";
import { toast } from "react-toastify";
import VehicleInfo from "./VehicleInfo";
import VehicleOngoingDetails from "./VehicleOngoingDetails";
import VehicleCostDetails from "./VehicleCostDetails";
import InventoryDetailsBtnControls from "./InventoryDetailsBtnControls";
import { costDetailsSchems } from "@/Schemas";
import UploadDocuments, { DocumentsMetaData } from "./UploadDocuments";
import { inventoryDetailsTabs } from "@/models/inventory";
import { useUserData } from "@/hooks/useUserData";
import Link from "next/link";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { getCommonData } from "@/app/store/master-data-slice";
import { VehicleUpdates } from "./vechile-updates";
import { ImageSlider } from "./image-slider";
import DialogModal from "../control-components/DialogModal";
import { AddedCostDetails } from "./AddedCostDetails";

type InventoryDetailsProps = {
  inventoryId?: number;
  close?: () => void;
  reFetchInventories?: () => void;
};

const inventoryDocumentsConfig: DocumentsMetaData[] = [
  { label: "Upload Title", docType: documentType.title, name: "Title" },
  { label: "Upload Invoice", docType: documentType.invoice, name: "Invoice" },
  {
    label: "Upload Contract",
    docType: documentType.contract,
    name: "Contract",
  },
  {
    label: "Upload State Inspection",
    docType: documentType.inspection,
    name: "Inspection",
  },
  {
    label: "Upload Other Documents",
    docType: documentType.others,
    name: "Others",
  },
  {
    label: "Upload Sales Bill",
    docType: documentType.slaesBill,
    name: "SlaesBill",
  },
];

const inventoryImagesConfig: DocumentsMetaData[] = [
  { label: "Front Image", docType: imageType.front, name: "FrontImage" },
  { label: "Back Image", docType: imageType.back, name: "BackImage" },
  {
    label: "Side Image",
    docType: imageType.side,
    name: "SideImage",
  },
  {
    label: "Damage Image",
    docType: imageType.damage,
    name: "DamageImage",
  },
];

export default function InventoryDetails({
  inventoryId,
  close,
  reFetchInventories,
}: InventoryDetailsProps) {
  const { contractors } = useRepresentative();
  const { vehicleUpdates, refetchVehicleUpdates } = useGetVechileUpdates(
    inventoryId!
  );
  const isAddedCostModalVisible = useStoreSelector(
    (state) => state.modal.isAddedCostModalVisible
  );
  const dispatch = useStoreDispatch();
  const [activeTab, setActiveTab] = useState<string>(
    inventoryDetailsTabs.details
  );
  const { invData, isFetching, isError, error, refetch } = useGetInventoryById(
    inventoryId!
  );

  const { userId, userName, role } = useUserData();
  const isAdmin = role?.trim() === "Admin";

  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<Inventory>({
    initialValues: invData!,
    validationSchema: costDetailsSchems,
    enableReinitialize: true,
    onSubmit: (values, actions) => submitHandler(values, actions),
  });

  const { upsertInventory, isSuccess, isPending } = useInventoryCUD();

  if (isFetching) {
    return <ThreeDotLoader />;
  }

  const switchHandler = (
    event: ChangeEvent<HTMLInputElement>,
    controlName: string
  ) => {
    handleChange(event);

    setValues((prevState) => {
      if (controlName === "isWholeSale") {
        return {
          ...prevState,
          typeOfSale: event.target.checked ? "Wholesale" : "",
          isInspection: event.target.checked ? true : false,
          isOnline: event.target.checked ? true : false,
          isRegistration: event.target.checked ? true : false,
          isLicensePlate: event.target.checked ? true : false,
          [controlName]: event.target.checked,
          updatedById: userId,
        };
      } else {
        return {
          ...prevState,
          [controlName]: event.target.checked,
          updatedById: userId,
        };
      }
    });
    handleSubmit();
    refreshData();
  };

  const refreshData = () => {
    setTimeout(() => {
      reFetchInventories && reFetchInventories();
      dispatch(getCommonData());
    }, 300);
  };

  const titleSwitchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const value = event.target.checked ? "Here" : "Not Here";
    setValues((prevState) => {
      return { ...prevState, title: value };
    });
    handleSubmit();
    refreshData();
  };

  const submitHandler = (
    values: Inventory,
    _actions: FormikHelpers<Inventory>
  ) => {
    values.updatedById = userId;
    upsertInventory(values);
    toast.success("Changes are updated successfully!!");
    // setTimeout(() => {
    //   refetch();
    // }, 500);
  };

  const updatedAddedCost = (totalAddedCost: number) => {
    setValues((prevValues) => {
      return { ...prevValues!, totalAddedCost: totalAddedCost };
    });
  };

  if (isError) {
    toast.error("Something went wrong, Please reach out to admin team");
  }

  return (
    <>
      {isAddedCostModalVisible && (
        <DialogModal>
          <AddedCostDetails
            inventoryId={inventoryId}
            contractors={contractors!}
            updatedAddedCost={updatedAddedCost}
          />
        </DialogModal>
      )}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === inventoryDetailsTabs.details ? "active" : ""}`}
            aria-current="page"
            href=""
            onClick={() => setActiveTab(inventoryDetailsTabs.details)}
          >
            {inventoryDetailsTabs.details}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === inventoryDetailsTabs.documents ? "active" : ""}`}
            href=""
            onClick={() => setActiveTab(inventoryDetailsTabs.documents)}
          >
            {inventoryDetailsTabs.documents}
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === inventoryDetailsTabs.images ? "active" : ""}`}
            href=""
            onClick={() => setActiveTab(inventoryDetailsTabs.images)}
          >
            {inventoryDetailsTabs.images}
          </Link>
        </li>
        {isAdmin && (
          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === inventoryDetailsTabs.costDetails ? "active" : ""}`}
              href="#"
              onClick={() => setActiveTab(inventoryDetailsTabs.costDetails)}
            >
              {inventoryDetailsTabs.costDetails}
            </a>
          </li>
        )}
      </ul>
      <div
        className="container-fluid "
        style={{
          width: "60vw",
          minHeight: "50vh",
          maxHeight: "80vh",
          overflow: "auto",
        }}
      >
        {activeTab === inventoryDetailsTabs.details && (
          <div className="d-flex flex-column gap-3">
            <form onSubmit={handleSubmit}>
              <div className="d-flex gap-3 mt-2">
                {values && (
                  <>
                    <VehicleInfo inventory={values} />
                    <VehicleOngoingDetails
                      handleSubmit={handleSubmit}
                      switchHandler={switchHandler}
                      titleSwitchHandler={titleSwitchHandler}
                      values={values}
                    />
                    <VehicleUpdates
                      data={vehicleUpdates!}
                      vehicleDetails={`${values?.iYear} ${values?.make} ${values?.model}`}
                    />
                  </>
                )}
              </div>
            </form>
          </div>
        )}
        {activeTab === inventoryDetailsTabs.documents && (
          <UploadDocuments
            showSlider={false}
            inventoryId={inventoryId!}
            fileUploadConfiguration={inventoryDocumentsConfig}
          />
        )}
        {activeTab === inventoryDetailsTabs.images && (
          <>
            <UploadDocuments
              showSlider={true}
              inventoryId={inventoryId!}
              fileUploadConfiguration={inventoryImagesConfig}
            />
          </>
        )}
        {activeTab === inventoryDetailsTabs.costDetails && (
          <VehicleCostDetails
            inventoryId={inventoryId!}
            values={values}
            handleChange={handleChange}
            setValues={setValues}
            errors={errors}
            touched={touched}
            handleSubmit={handleSubmit}
          />
        )}
      </div>
      <InventoryDetailsBtnControls close={close} inventory={values} />
    </>
  );
}
