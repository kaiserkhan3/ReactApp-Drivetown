"use client";

import { RepresentativeDto } from "@/models/inventory";
import { GroupControl } from "../control-components/group-control";
import { FormikHelpers, useFormik } from "formik";
import { representativeInitialValues } from "./Initial-values/representative-initial-values";
import { representativeSchema } from "@/Schemas";
import { useEffect } from "react";
import {
  useCreateOrUpdateRepresentativeHook,
  useRepresentativeinfById,
} from "@/hooks/useInventory";

type AddContractorProps = {
  id?: number;
  type: string;
  close: () => void;
};

export const AddContractor = ({
  id,
  type = "Contractor",
  close,
}: AddContractorProps) => {
  const { data, refetch } = useRepresentativeinfById(id!);
  const { upsertRepresentative } = useCreateOrUpdateRepresentativeHook();
  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<RepresentativeDto>({
    initialValues:
      data ||
      Object.assign(representativeInitialValues, {
        representativeType: type,
      }),
    validationSchema: representativeSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => onSubmit(values, actions),
  });

  const onSubmit = (
    values: RepresentativeDto,
    formikHelpers: FormikHelpers<RepresentativeDto>
  ) => {
    console.log(values);
    upsertRepresentative(values);
    close();
  };

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  return (
    <form onSubmit={handleSubmit}>
      <div className="row m-2 p-4" style={{ width: "40rem" }}>
        <div className="col-12">
          <GroupControl id="representativeFirstName" label="Contractor Name">
            <input
              type="text"
              className="form-control"
              id="representativeFirstName"
              name="representativeFirstName"
              autoComplete="off"
              defaultValue={values.representativeFirstName}
              onChange={handleChange}
              placeholder="Enter Contractor Name"
              aria-label="representativeFirstName"
              aria-describedby="representativeFirstName"
            />
          </GroupControl>
          {/* {showErrorMessage("firstName")} */}
        </div>
        <div className="col-12">
          <GroupControl id="representativeLastName" label="Organization Name">
            <input
              type="text"
              className="form-control"
              id="representativeLastName"
              name="representativeLastName"
              defaultValue={values.representativeLastName}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter Organization name"
              aria-label="representativeLastName"
              aria-describedby="representativeLastName"
            />
          </GroupControl>
          {/* {showErrorMessage("lastName")} */}
        </div>
        <div className="col-12">
          <GroupControl id="representativeMobile" label="Phone Number">
            <input
              type="text"
              className="form-control"
              id="representativeMobile"
              name="representativeMobile"
              defaultValue={values.representativeMobile}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter Phone Number"
              aria-label="representativeMobile"
              aria-describedby="representativeMobile"
            />
          </GroupControl>
          {/* {showErrorMessage("userName")} */}
        </div>
        <div className="col-12">
          <GroupControl id="representativeEmail" label="Email">
            <input
              type="text"
              className="form-control"
              id="representativeEmail"
              name="representativeEmail"
              defaultValue={values.representativeEmail}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter Email"
              aria-label="representativeEmail"
              aria-describedby="representativeEmail"
            />
          </GroupControl>
          {/* {showErrorMessage("userName")} */}
        </div>

        <div className="col-12" style={{ textAlign: "right" }}>
          <button type="button" className="btn btn-danger me-2" onClick={close}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-hover">
            Save
          </button>
        </div>
      </div>
    </form>
  );
};
