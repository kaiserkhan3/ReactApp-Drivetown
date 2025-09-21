"use client";
import { useGetAdedCostDataById } from "@/hooks/useInventory";
import { AddecCostDto, RepresentativeDto } from "@/models/inventory";
import { addedCostSchema } from "@/Schemas";
import { FormikHelpers, useFormik } from "formik";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import AddedCostList from "./AddedCostList";
import { useStoreDispatch } from "@/app/store/hook";
import { updateAddedCostModalCloseState } from "@/app/store/modal-slice";
import moment from "moment";
import { MdDeleteForever } from "react-icons/md";
import { useAddedCostCUD, useDeleteAddedCostImage } from "@/hooks/useAddedCost";
import { MdBrowserUpdated } from "react-icons/md";
import { FaRegSave } from "react-icons/fa";
import { IoCloseCircleSharp } from "react-icons/io5";
import { AddedCostImageDto } from "@/models/inventory/addedcost.model";
import { useUserData } from "@/hooks/useUserData";

type AddedCostDetailsProps = {
  inventoryId?: number;
  contractors: RepresentativeDto[];
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

export const AddedCostDetails = ({
  inventoryId,
  contractors,
}: AddedCostDetailsProps) => {
  const { userId } = useUserData();
  const { addedCostData } = useGetAdedCostDataById(inventoryId!);

  const { upsertAddedCostCUD, data } = useAddedCostCUD();
  const [files, setFiles] = useState<File[]>([]);

  const dispatch = useStoreDispatch();
  const { deleteAddedCostImage } = useDeleteAddedCostImage();
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

  const viewImage = (item: AddedCostImageDto) => {
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
    const formData = new FormData();
    formData.append("addedCostDto", JSON.stringify(row));
    const response = upsertAddedCostCUD({ formData: formData, operation: "d" });
  };

  const contractChangeHandler = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = contractors.find(
      (i) => i.representativeId === parseInt(event.target.value)
    );
    setValues((prevState) => {
      return {
        ...prevState,
        contractorId: parseInt(event.target.value),
        description: value?.representativeFirstName,
      };
    });
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
    toast.success("Changes are updated successfully!!");
  };

  return (
    <>
      <div className="d-flex flex-column p-2 gap-3 align-items-center">
        <form onSubmit={handleSubmit}>
          <div className="row g-3" style={{ width: "28rem" }}>
            <div className="col-md-6">
              <label htmlFor="contractorId">Payment Details</label>
              <select
                className="form-select"
                id="contractorId"
                name="contractorId"
                aria-label="Floating label select example"
                defaultValue={values?.contractorId}
                onChange={contractChangeHandler}
                onBlur={handleBlur}
              >
                <option key="selectContractor" value="">
                  Select
                </option>
                {contractorsData}
              </select>

              {errors?.contractorId && touched.contractorId && (
                <p className="text-danger">{errors.contractorId}</p>
              )}
            </div>
            <div className="col-md-6">
              <label htmlFor="adate">Paid Date</label>
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
            </div>
            <div className="col-md-6">
              <label htmlFor="atype">Paid Type</label>
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
                <option key="CreditCard" value="Credit Card">
                  Credit Card
                </option>
              </select>
            </div>
            <div className="col-md-6">
              <label htmlFor="price">Cost</label>
              <input
                type="text"
                className="form-control"
                id="price"
                name="price"
                placeholder="Enter Cost"
                defaultValue={values.price}
                onChange={priceChangeHandler}
                onBlur={handleBlur}
              />
              {errors?.price && touched.price && (
                <p className="text-danger">{errors.price}</p>
              )}
            </div>

            <div>
              <label htmlFor="description">Comments</label>
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
                    {file.name}
                    <MdDeleteForever
                      size="20px"
                      color="red"
                      onClick={() => removeFileFromState(file)}
                    />
                  </span>
                ))}
              </>
            </div>
            <div className="d-flex gap-3 flex-wrap justify-content-center">
              <>
                {values.addedCostAttachments?.map((item, index) => (
                  <span
                    key={item.addedCostImageId}
                    style={{ color: "blue", cursor: "pointer" }}
                  >
                    <span onClick={() => viewImage(item)}>
                      {`Recipt ${index + 1}`}
                    </span>
                    <MdDeleteForever
                      size="20px"
                      color="red"
                      onClick={() => deleteAddedCostImage(item)}
                    />
                  </span>
                ))}
              </>
            </div>
            <div className="d-flex justify-content-between">
              <button
                type="button"
                className="btn btn-danger btn-hover"
                onClick={() =>
                  dispatch(
                    updateAddedCostModalCloseState({
                      isAddedCostModalVisible: false,
                    })
                  )
                }
              >
                <IoCloseCircleSharp size="20px" color="#fff" className="me-1" />
                Close
              </button>
              <button
                type="submit"
                className="ms-auto btn btn-primary btn-hover"
              >
                {values.addedCostId ? (
                  <MdBrowserUpdated size="20px" color="#fff" className="me-2" />
                ) : (
                  <FaRegSave size="20px" color="#fff" className="me-2" />
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
