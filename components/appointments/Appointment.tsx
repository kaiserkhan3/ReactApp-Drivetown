import { useStoreDispatch } from "@/app/store/hook";
import { updateIsAppointmentVisibleFlag } from "@/app/store/modal-slice";
import {
  useAppointmentCud,
  useGetAppointmentById,
  useGetVehicleDataForDropDown,
} from "@/hooks/useAppointments";
import {
  appointmentAction,
  AppointmentDto,
  appointmentInitialValues,
} from "@/models/Appoinments";
import { appointmentSchema } from "@/Schemas";
import { formatPhoneNumber, unFormatPhoneNumber } from "@/utilities";
import { FormikHelpers, useFormik } from "formik";
import moment from "moment";
import { ChangeEvent, useState } from "react";
import DialogModal from "../control-components/DialogModal";
import { ReturnValuesType, SendMessage } from "./SendMessage";
import { useGetSMSTemplates } from "@/hooks/useMessageTemplate";
import { ISMSTemplateDto, templateTypes } from "@/models/message-template";
import { replaceHashKeys } from "@/utilities/replace-hash-keys";
import { useUserData } from "@/hooks/useUserData";
import { updateAppointmentCount } from "@/app/store/master-data-slice";
import { GroupControl } from "../control-components/group-control";

type AppoinmentProps = {
  selectedDate?: string;
  appointmentId?: number;
  month: number;
  year: number;
};

export const Appointment = ({
  selectedDate,
  appointmentId,
  month,
  year,
}: AppoinmentProps) => {
  const { userId, userName, role } = useUserData();
  const dispatch = useStoreDispatch();
  const { messageTemplatesData } = useGetSMSTemplates();
  const [messagePopup, setMessagePopup] = useState<
    { isVisible: boolean; message: string; actionType: string } | undefined
  >(undefined);

  const { vehiclesDataForDropdown } = useGetVehicleDataForDropDown();

  const { appointmentData, refetch } = useGetAppointmentById(appointmentId!);
  if (appointmentId) {
    refetch();
  }
  const { upsertAppoinment, isSuccess, status } = useAppointmentCud(
    month,
    year
  );

  const { values, setValues, handleChange, handleSubmit, errors, touched } =
    useFormik<AppointmentDto>({
      initialValues:
        appointmentData ||
        Object.assign(appointmentInitialValues, {
          appointmentDate: selectedDate,
        }),
      enableReinitialize: true,
      validationSchema: appointmentSchema,
      onSubmit: (values, actions) => submitHandler(values, actions),
    });

  const submitHandler = (
    values: AppointmentDto,
    actions: FormikHelpers<AppointmentDto>
  ) => {
    values.action =
      values.appointmentId && values.appointmentId > 0
        ? values.action
        : appointmentAction.created;
    values.contactNo = unFormatPhoneNumber(values.contactNo!);
    if (values.appointmentId && values.appointmentId > 0) {
      values.updatedById = userId;
    } else {
      values.createdById = userId;
    }

    let message = replaceHashKeys(
      messageTemplatesData![templateTypes.new as keyof ISMSTemplateDto]
        .messageTemplate,
      values.customerName!,
      userName!,
      values.vehicleInfo!,
      moment(values.appointmentDate).format("MM-DD-YYYY")
    );
    if (!values.appointmentId) {
      setMessagePopup(() => {
        return {
          isVisible: true,
          message: message,
          actionType: values.action!,
        };
      });
    } else {
      upsertAppoinment(values);

      dispatch(updateIsAppointmentVisibleFlag({ isAppointmentVisble: false }));
    }
  };

  const handleActionBtnClick = (templateName: string, action: string) => {
    setValues((prevState) => {
      return { ...prevState, action: action };
    });
    let message = replaceHashKeys(
      messageTemplatesData![templateName as keyof ISMSTemplateDto]
        .messageTemplate,
      values.customerName!,
      userName!,
      values.vehicleInfo!,
      moment(values.appointmentDate).format("MM-DD-YYYY")
    );
    setMessagePopup(() => {
      return {
        isVisible: true,
        message: message,
        actionType: action,
      };
    });
  };

  const onMessageTemplateSaveChanges = (data: ReturnValuesType) => {
    values.contactNo = unFormatPhoneNumber(values.contactNo!);
    values.sendSMS = data.sendSms;
    values.message = data.message;
    values.updatedById = userId;
    console.log(values);

    if (!values.appointmentId) dispatch(updateAppointmentCount());
    upsertAppoinment(values);

    dispatch(updateIsAppointmentVisibleFlag({ isAppointmentVisble: false }));
  };

  const refferBy = ["CarGurus", "CarFax", "OfferUp", "Facebook", "Others"]?.map(
    (p) => (
      <option key={p} value={p}>
        {p}
      </option>
    )
  );

  const vehiclesDropdownOptions = vehiclesDataForDropdown?.map((op) => (
    <option key={op.inventoryId} value={op.vehicleInfo} />
  ));

  const phoneNumberChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const value = formatPhoneNumber(event.target.value);
    if (!value) return;
    setValues((prevState) => {
      return {
        ...prevState,
        contactNo: value,
      };
    });
  };

  const vehicleInfoChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    handleChange(event);
    const { name, value } = event.target;
    const record = vehiclesDataForDropdown?.find(
      (i) => i.vehicleInfo === value
    );
    if (record) {
      setValues((preState) => {
        return {
          ...preState,
          inventoryId: record.inventoryId,
          vehicleInfo: value,
        };
      });
    }
  };

  return (
    <>
      {messagePopup?.isVisible && (
        <DialogModal top={"18rem"}>
          <SendMessage
            notes={values.notes || ""}
            message={messagePopup.message}
            apnType={messagePopup.actionType}
            sendData={onMessageTemplateSaveChanges}
          />
        </DialogModal>
      )}
      <form onSubmit={handleSubmit}>
        <div
          className="d-flex flex-column m-5 gap-2"
          style={{ minWidth: "30rem" }}
        >
          <div>
            <GroupControl id="vehicleInfo" label="Select Vehicle info">
              <input
                className="form-control"
                list="datalistOptions"
                id="vehicleInfo"
                name="vehicleInfo"
                value={values.vehicleInfo || ""}
                placeholder="Type a year for search..."
                onChange={vehicleInfoChangeHandler}
              />
              <datalist id="datalistOptions">
                {vehiclesDropdownOptions}
              </datalist>
            </GroupControl>

            {errors?.vehicleInfo && touched.vehicleInfo && (
              <p className="text-danger">{errors.vehicleInfo}</p>
            )}
          </div>
          <div>
            <GroupControl id="customerName" label="Customer Name">
              <input
                type="text"
                className="form-control"
                id="customerName"
                name="customerName"
                placeholder="Enter a make"
                defaultValue={values.customerName}
                onChange={handleChange}
              />
            </GroupControl>

            {errors?.customerName && touched.customerName && (
              <p className="text-danger">{errors.customerName}</p>
            )}
          </div>
          <div>
            <GroupControl id="customerAddress" label="Customer Address">
              <textarea
                className="form-control"
                placeholder="Type address here..."
                id="customerAddress"
                name="customerAddress"
                style={{ height: "4rem" }}
                defaultValue={values.customerAddress}
                onChange={handleChange}
              ></textarea>
            </GroupControl>
          </div>
          <div>
            <GroupControl id="contactNo" label="Phone Number">
              <input
                type="text"
                className="form-control"
                id="contactNo"
                name="contactNo"
                value={formatPhoneNumber(values.contactNo!) || ""}
                placeholder="Enter Customer Phone Number"
                onChange={phoneNumberChangeHandler}
              />
            </GroupControl>

            {errors?.contactNo && touched.contactNo && (
              <p className="text-danger">{errors.contactNo}</p>
            )}
          </div>
          <div>
            <GroupControl id="email" label="">
              <input
                type="text"
                className="form-control"
                id="email"
                name="email"
                defaultValue={values.email}
                placeholder="Enter Customer Email"
                onChange={handleChange}
              />
            </GroupControl>
          </div>
          <div>
            <GroupControl id="appointmentDate" label="Appointment Date">
              <input
                type="date"
                className="form-control"
                id="appointmentDate"
                name="appointmentDate"
                placeholder="Select date"
                value={
                  moment(values.appointmentDate).format("YYYY-MM-DD") ||
                  moment().format("YYYY-MM-DD")
                }
                onChange={handleChange}
              />
            </GroupControl>
          </div>
          <div>
            <GroupControl id="referredBy" label="Reffered By">
              <select
                className="form-select"
                id="referredBy"
                name="referredBy"
                value={values?.referredBy || ""}
                aria-label="Floating label select example"
                onChange={handleChange}
              >
                <option key="SelectsoldBy" value="">
                  Select Reffered by
                </option>
                {refferBy}
              </select>
            </GroupControl>
          </div>
          <div>
            <GroupControl id="notes" label="Comments">
              <textarea
                className="form-control"
                placeholder="Type Comments here"
                id="notes"
                name="notes"
                defaultValue={values.notes}
                onChange={handleChange}
                style={{ height: "6rem" }}
              ></textarea>
            </GroupControl>
          </div>
          <div className="d-flex gap-2 mt-3 justify-content-md-between">
            <button
              type="button"
              className="btn btn-outline-danger btn-hover"
              onClick={() =>
                dispatch(
                  updateIsAppointmentVisibleFlag({ isAppointmentVisble: false })
                )
              }
            >
              Close
            </button>
            {values.appointmentId && (
              <>
                {/* <button
                  type="button"
                  className="btn btn-danger text-center align-content-center"
                >
                  <MdDeleteForever size="18px" color="white" className="me-1" />
                  Delete
                </button> */}

                <button
                  type="button"
                  className="btn btn-success btn-hover"
                  onClick={() =>
                    handleActionBtnClick("show", appointmentAction.show)
                  }
                >
                  Show
                </button>
                <button
                  type="button"
                  className="btn btn-danger btn-hover"
                  onClick={() =>
                    handleActionBtnClick("noShow", appointmentAction.noShow)
                  }
                >
                  No Show
                </button>
                <button
                  type="button"
                  className="btn btn-warning"
                  onClick={() =>
                    handleActionBtnClick(
                      "reScheduled",
                      appointmentAction.reScheduled
                    )
                  }
                >
                  ReSchedule
                </button>
              </>
            )}

            <button type="submit" className="btn btn-primary">
              {values?.appointmentId ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </form>
    </>
  );
};
