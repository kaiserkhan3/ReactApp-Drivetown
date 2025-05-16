"use client";
import {
  useGetAdedCostDataById,
  useRepresentative,
} from "@/hooks/useInventory";
import { AddecCostDto, Representative } from "@/models/inventory";
import { addedCostSchema } from "@/Schemas";
import { FormikHelpers, useFormik } from "formik";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import AddedCostList from "./AddedCostList";
import { useStoreDispatch } from "@/app/store/hook";
import { updateAddedCostModalCloseState } from "@/app/store/modal-slice";
import moment from "moment";
import { MdDeleteForever } from "react-icons/md";
import { useAddedCostCUD } from "@/hooks/useAddedCost";
import { MdBrowserUpdated } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { AddedCostImage } from "@/models/inventory/addedcost.model";

type AddedCostDetailsProps = {
  inventoryId?: number;
};

const initialStateValues: AddecCostDto = {
  inventoryId: undefined,
  addedCostId: undefined,
  adate: undefined,
  atype: undefined,
  chequeNo: undefined,
  contractorId: undefined,
  description: undefined,
  isPaid: undefined,
  price: undefined,
  addedCostAttachments: [],
};

export const AddedCostDetails = ({ inventoryId }: AddedCostDetailsProps) => {
  const { addedCostData, error, isFetching } = useGetAdedCostDataById(
    inventoryId!
  );

  const { upsertAddedCostCUD, data } = useAddedCostCUD();
  const [files, setFiles] = useState<File[]>([]);

  const dispatch = useStoreDispatch();
  const { contractors } = useRepresentative();

  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<AddecCostDto>({
    initialValues: Object.assign(initialStateValues, {
      inventoryId: inventoryId,
      atype: "Cash",
      adate: moment().format("YYYY-MM-DD"),
    }),
    enableReinitialize: true,
    validationSchema: addedCostSchema,
    onSubmit: (values, actions) => submitHandler(values, actions),
  });

  const contractorsData = contractors?.map((p) => (
    <option key={p.representativeId} value={p.representativeId}>
      {p.representativeFirstName}
    </option>
  ));

  const switchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    setValues((prevState) => {
      return { ...prevState, isPaid: event.target.checked };
    });
  };

  const priceChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const value = event.target.value;
    if (value.length > 0 && !isNaN(parseInt(value))) {
      setValues((prevState) => {
        return {
          ...prevState,
          isPaid: true,
          price: parseInt(event.target.value),
        };
      });
    } else {
      setValues((prevState) => {
        return {
          ...prevState,
          isPaid: false,
        };
      });
    }
  };

  const viewImage = (item: AddedCostImage) => {
    window.open(
      process.env.NEXT_PUBLIC_ADDEDCOST_FILE_BASE_URL + item.imageName,
      "_blank"
    );
  };

  const fileUploadHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const filesFromEvent = event.target.files;
    if (filesFromEvent?.length === 0) {
      return;
    }
    setFiles((prevState) => {
      return [...prevState!, ...filesFromEvent!];
    });
  };

  const removeFileFromState = (file: File) => {
    setFiles((prevState) => {
      return prevState?.filter((f) => f.name !== file.name);
    });
  };

  const onEditRowHandler = (row: AddecCostDto) => {
    setValues(row);
  };
  const onDeleteRowHandler = (row: AddecCostDto) => {
    console.log("row", row);
    const formData = new FormData();
    formData.append("addedCostDto", JSON.stringify(row));
    const response = upsertAddedCostCUD({ formData: formData, operation: "d" });
  };

  const submitHandler = (
    values: AddecCostDto,
    actions: FormikHelpers<AddecCostDto>
  ) => {
    const formData = new FormData();
    files.forEach((f) => {
      formData.append("reciptFiles", f);
    });
    formData.append("addedCostDto", JSON.stringify(values));
    const operation = values.addedCostId ? "u" : "i";
    const response = upsertAddedCostCUD({ formData, operation });
    console.log("response ", response);
    toast.success("Changes are updated successfully!!");
  };

  return (
    <>
      <div className="d-flex flex-column p-2 gap-3 align-items-center">
        <form onSubmit={handleSubmit}>
          <div
            className="d-flex w-full flex-column gap-3 align-content-center"
            style={{ width: "28rem" }}
          >
            <div className="form-floating">
              <select
                className="form-select"
                id="contractorId"
                name="contractorId"
                aria-label="Floating label select example"
                value={values.contractorId || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option key="selectBuyer" value="">
                  Select Contractor
                </option>
                {contractorsData}
              </select>
              <label htmlFor="contractorId">Constractor</label>
              {errors?.contractorId && touched.contractorId && (
                <p className="text-danger">{errors.contractorId}</p>
              )}
            </div>
            <div className="form-floating">
              <input
                type="date"
                className="form-control"
                id="adate"
                name="adate"
                placeholder="Select date"
                defaultValue={moment(values.adate).format("YYYY-MM-DD")}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="adate">Paid Date</label>
            </div>
            <div className="form-floating">
              <select
                className="form-select"
                id="atype"
                name="atype"
                value={values.atype || "Cash"}
                aria-label="Floating label select example"
                onChange={handleChange}
                onBlur={handleBlur}
              >
                <option key="Cash" value="Cash">
                  Cash
                </option>
                <option key="Zelle" value="Zelle">
                  Zelle
                </option>
                <option key="Cheque" value="Cheque">
                  Cheque
                </option>
              </select>
              <label htmlFor="atype">Paid Type</label>
            </div>
            <div className="d-flex justify-content-between align-items-center gap-3">
              <div className={`form-floating`}>
                <input
                  type="text"
                  className="form-control"
                  id="price"
                  name="price"
                  placeholder="Enter Amount"
                  defaultValue={values.price}
                  onChange={priceChangeHandler}
                  onBlur={handleBlur}
                />
                <label htmlFor="price">Cost</label>
                {errors?.price && touched.price && (
                  <p className="text-danger">{errors.price}</p>
                )}
              </div>
              <div className="form-check form-switch text-center">
                <label htmlFor="isPaid">IsPaid</label>
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="isPaid"
                  name="isPaid"
                  checked={values.isPaid === true}
                  value={values.isPaid ? 1 : 0}
                  onChange={switchHandler}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className={`form-floating`}>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                placeholder="Enter comments any"
                value={values.description || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <label htmlFor="description">Comments</label>
            </div>
            <div className="mb-2">
              <label htmlFor="formFile" className="form-label">
                Upload a receipt
              </label>
              <input
                className="form-control"
                onChange={fileUploadHandler}
                multiple
                type="file"
                id="formFile"
              />
            </div>
            <div className="d-flex flex-column align-contnet-center justify-content-center">
              <>
                {files?.map((file) => (
                  <span key={file.name} style={{ color: "blue" }}>
                    {file.name}{" "}
                    <MdDeleteForever
                      color="red"
                      onClick={() => removeFileFromState(file)}
                    />
                  </span>
                ))}
              </>
            </div>
            <div className="d-flex justify-content-center">
              <>
                {values.addedCostAttachments?.map((item) => (
                  <span
                    key={item.addedCostImageId}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    <span onClick={() => viewImage(item)}>
                      {item.imageName}
                    </span>
                    <MdDeleteForever color="red" />
                  </span>
                ))}
              </>
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-warning btn-hover text-center"
                onClick={() =>
                  dispatch(
                    updateAddedCostModalCloseState({
                      isAddedCostModalVisible: false,
                    })
                  )
                }
              >
                <IoCloseCircleSharp color="#fff" className="me-1" />
                Close
              </button>
              <button
                type="submit"
                className="ms-auto btn btn-primary btn-hover"
              >
                {values.addedCostId ? (
                  <MdBrowserUpdated color="#fff" className="me-2" />
                ) : (
                  <FaRegSave color="#fff" className="me-2" />
                )}
                {values.addedCostId ? "Update" : "Save"}
              </button>
            </div>
          </div>
        </form>
        <div className="d-flex" style={{ width: "28rem" }}>
          {addedCostData!?.length > 0 && (
            <AddedCostList
              rows={addedCostData!}
              editRow={onEditRowHandler}
              deleteRow={onDeleteRowHandler}
            />
          )}
        </div>
      </div>
    </>
  );
};
