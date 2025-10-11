"use client";
import { ChangeEvent, useEffect, useState } from "react";
import { FileUpload } from "../control-components/FileUpload";
import { GroupControl } from "../control-components/group-control";
import { UserDto } from "@/models/inventory/models";
import { FormikErrors, FormikHelpers, useFormik } from "formik";
import { CreateUserSchema } from "@/Schemas";
import { UserInitialValues } from "./Initial-values/user-initial-values";
import { useGetUserDetailHook, useUserCUD } from "@/hooks/useUserData";
import { openDocumentInNewTab } from "@/utilities";

export const CreateUser = ({
  userId,
  closeBtnHandler,
}: {
  userId?: number;
  closeBtnHandler: () => void;
}) => {
  const [filesList, setFilesList] = useState<File[]>([]);
  const { upsertUser, isSuccess, isError } = useUserCUD();
  const [showSSN, setShowSSN] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const { data, refetch } = useGetUserDetailHook(userId!);

  const {
    values,
    setValues,
    handleBlur,
    handleChange,
    handleSubmit,
    errors,
    touched,
  } = useFormik<UserDto>({
    initialValues: data?.userDto || UserInitialValues,
    validationSchema: CreateUserSchema,
    enableReinitialize: true,
    onSubmit: (values, actions) => onSubmit(values, actions),
  });
  const formData = new FormData();
  useEffect(() => {
    if (userId) {
      refetch();
    }
  }, [userId]);

  const onSubmit = (values: UserDto, formikHelpers: FormikHelpers<UserDto>) => {
    formData.append("user", JSON.stringify(values));
    if (filesList.length > 0) {
      filesList.forEach((f) => {
        formData.append("files", f);
      });
    }
    upsertUser(formData);
    closeBtnHandler();
  };

  const toggleUserStatus = () => {
    values.isActive = !values.isActive;
    formData.append("user", JSON.stringify(values));
    upsertUser(formData);
  };

  const fileUploadHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = event.target;

    if (files?.length == 0) {
      return;
    }
    setFilesList((prevstate) => {
      return [...filesList, ...files!];
    });
  };
  const showErrorMessage = (fieldName: string) => {
    const field = fieldName as keyof FormikErrors<UserDto>;

    if (errors?.[field] && touched?.[field]) {
      return <p className="text-danger ms-2">{errors?.[field]}</p>;
    }
    return null;
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row m-2 p-4" style={{ width: "60rem" }}>
        <div className="col-md-6">
          <GroupControl id="firstName" label="First Name">
            <input
              type="text"
              className="form-control"
              id="firstName"
              name="firstName"
              autoComplete="off"
              defaultValue={values.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
              aria-label="firstName"
              aria-describedby="firstName"
            />
          </GroupControl>
          {showErrorMessage("firstName")}
        </div>
        <div className="col-md-6">
          <GroupControl id="lastName" label="Last Name">
            <input
              type="text"
              className="form-control"
              id="lastName"
              name="lastName"
              defaultValue={values.lastName}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter Last Name"
              aria-label="lastName"
              aria-describedby="lastName"
            />
          </GroupControl>
          {showErrorMessage("lastName")}
        </div>
        <div className="col-md-6">
          <GroupControl id="userName" label="User Name">
            <input
              type="text"
              className="form-control"
              id="userName"
              name="userName"
              defaultValue={values.userName}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter User Name"
              aria-label="userName"
              aria-describedby="userName"
            />
          </GroupControl>
          {showErrorMessage("userName")}
        </div>
        <div className="col-md-6">
          <GroupControl id="upassword" label="Password">
            <input
              type={showPwd ? "text" : "password"}
              className="form-control"
              id="upassword"
              name="upassword"
              defaultValue={values.upassword}
              autoComplete="off"
              onChange={handleChange}
              placeholder="Enter Password"
              aria-label="upassword"
              aria-describedby="upassword"
            />
            <span className="input-group-text">
              <button
                type="button"
                className="btn btn-sm btn-icon"
                title="View"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? (
                  <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye"></i>
                )}
              </button>
            </span>
          </GroupControl>
          {showErrorMessage("upassword")}
        </div>
        <div className="col-md-6">
          <GroupControl id="phoneNumber" label="Phone Number">
            <input
              type="text"
              className="form-control"
              id="phoneNumber"
              name="phoneNumber"
              defaultValue={values.phoneNumber}
              autoComplete="off"
              onChange={handleChange}
              placeholder="Enter Phone Number"
              aria-label="phoneNumber"
              aria-describedby="phoneNumber"
            />
          </GroupControl>
        </div>
        <div className="col-md-6">
          <GroupControl id="ssnumber" label="SSN Number">
            <input
              type={showSSN ? "text" : "password"}
              className="form-control"
              id="ssnumber"
              name="ssnumber"
              defaultValue={values.ssnumber}
              autoComplete="off"
              onChange={handleChange}
              placeholder="Enter SSN Number"
              aria-label="ssnumber"
              aria-describedby="ssnumber"
            />
            <span className="input-group-text">
              <button
                type="button"
                className="btn btn-sm btn-icon"
                title="View"
                onClick={() => setShowSSN(!showSSN)}
              >
                {showSSN ? (
                  <i className="bi bi-eye-slash"></i>
                ) : (
                  <i className="bi bi-eye"></i>
                )}
              </button>
            </span>
          </GroupControl>
        </div>
        <div className="col-md-6">
          <GroupControl id="email" label="Email">
            <input
              type="text"
              className="form-control"
              id="email"
              name="email"
              autoComplete="off"
              defaultValue={values.email}
              onChange={handleChange}
              placeholder="Enter Email"
              aria-label="email"
              aria-describedby="email"
            />
          </GroupControl>
          {showErrorMessage("email")}
        </div>
        <div className="col-md-6">
          <GroupControl id="eaddress" label="Address">
            <input
              type="text"
              className="form-control"
              id="eaddress"
              name="eaddress"
              defaultValue={values.eaddress}
              autoComplete="off"
              onChange={handleChange}
              placeholder="Enter Address"
              aria-label="eaddress"
              aria-describedby="eaddress"
            />
          </GroupControl>
        </div>
        <div className="col-md-6">
          <GroupControl id="salaryType" label="Salary Type">
            <select
              className="form-select"
              id="salaryType"
              name="salaryType"
              value={values.salaryType}
              onChange={handleChange}
              aria-label="Floating label select example"
            >
              <option key="selected" value="">
                Select Salary Type
              </option>
              {["Hourly", "Weekly", "Monthly"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </GroupControl>
        </div>
        <div className="col-md-6">
          <GroupControl id="salary" label="Salary">
            <input
              type="text"
              className="form-control"
              id="salary"
              name="salary"
              defaultValue={values.salary}
              autoComplete="off"
              onChange={handleChange}
              placeholder="Enter Salary"
              aria-label="salary"
              aria-describedby="salary"
            />
          </GroupControl>
          {showErrorMessage("salary")}
        </div>
        <div className="col-md-6">
          <GroupControl id="urole" label="Role">
            <select
              className="form-select"
              id="urole"
              name="urole"
              value={values.urole}
              onChange={handleChange}
              aria-label="Floating label select example"
            >
              <option key="selected" value="">
                Select a Role
              </option>
              {["Admin", "Employee", "Accountant", "Manager"].map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </GroupControl>
          {showErrorMessage("urole")}
        </div>
        <div className="col-md-6">
          <GroupControl id="notes" label="Notes">
            <input
              type="text"
              className="form-control"
              id="notes"
              name="notes"
              defaultValue={values.notes}
              onChange={handleChange}
              autoComplete="off"
              placeholder="Enter Notes"
              aria-label="notes"
              aria-describedby="notes"
            />
          </GroupControl>
        </div>
        <div className="col-12" style={{ textAlign: "center" }}>
          <FileUpload label="Upload Files" handleChange={fileUploadHandler} />
        </div>
        {data?.documents!?.length > 0 && (
          <div className="col-12 mb-3" style={{ border: "1px solid blue" }}>
            <div className="d-flex gap-2 flex-wrap">
              {data?.documents?.map((f, index) => (
                <span
                  key={f.documentName + index}
                  style={{
                    cursor: "pointer",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                  onClick={() => openDocumentInNewTab("Users", f.documentName)}
                >
                  <small>{index + 1}. </small>
                  {f.documentName}
                </span>
              ))}
            </div>
          </div>
        )}
        {filesList.length > 0 && (
          <div className="col-12 mb-3" style={{ border: "1px solid blue" }}>
            <div className="d-flex gap-2 flex-wrap">
              {filesList.map((f, index) => (
                <span key={f.name + index}>
                  <small>{index + 1}. </small>
                  {f.name}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="col-12" style={{ textAlign: "right" }}>
          <button
            type="button"
            className="btn btn-danger me-2"
            onClick={closeBtnHandler}
          >
            Cancel
          </button>
          <button type="submit" className="btn btn-primary btn-hover me-2">
            {values.userId ? "Update" : "Create"} User
          </button>
          {values?.userId && (
            <button
              type="button"
              className="btn btn-hover"
              style={{ backgroundColor: "purple", color: "#FFF" }}
              onClick={toggleUserStatus}
            >
              {values.isActive ? "Deactivate User" : "Activate User"}
            </button>
          )}
        </div>
      </div>
    </form>
  );
};
