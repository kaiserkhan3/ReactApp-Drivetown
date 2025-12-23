import { appointmentAction } from "@/models/Appoinments";
import { ChangeEvent, useEffect, useState } from "react";

type SendMessageProps = {
  notes: string;
  message: string;
  apnType: string;
  sendData: (values: ReturnValuesType) => void;
  cancelHandler: () => void;
};
export type ReturnValuesType = {
  notes?: string;
  message: string;
  sendSms: boolean;
  isVehiclePurchased?: boolean;
};
export function SendMessage({
  notes,
  message,
  apnType,
  sendData,
  cancelHandler,
}: SendMessageProps) {
  const [sendSms, setSendSms] = useState(0);
  const [isVehiclePurchased, setIsVehiclePurchased] = useState(0);
  const [popupValues, setPopupValues] = useState<ReturnValuesType | undefined>(
    undefined
  );

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setPopupValues((preState) => {
      return {
        ...preState!,
        [name as keyof ReturnValuesType]: value,
        sendSms: sendSms === 0 ? false : true,
      };
    });
  };

  const handleSendSMS = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setSendSms(() => (parseInt(value) === 0 ? 1 : 0));
    setPopupValues((preState) => {
      return {
        ...preState!,
        [name as keyof ReturnValuesType]: parseInt(value) === 0 ? true : false,
        isVehiclePurchased: isVehiclePurchased === 0 ? false : true,
      };
    });
  };

  const handleVehiclePurchased = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setIsVehiclePurchased(() => (parseInt(event.target.value) === 0 ? 1 : 0));
    setPopupValues((preState) => {
      return {
        ...preState!,
        [name as keyof ReturnValuesType]: parseInt(value) === 0 ? true : false,
        sendSms: sendSms === 0 ? false : true,
      };
    });
  };

  useEffect(() => {
    setPopupValues(() => {
      return {
        notes: notes,
        message: message,
        sendSms: sendSms === 0 ? false : true,
      };
    });
  }, []);
  return (
    <div className="d-flex m-3 gap-2 justify-content-center">
      <div
        className="d-flex flex-column gap-3"
        style={{ minWidth: "30rem", minHeight: "24rem" }}
      >
        {apnType !== appointmentAction.created && (
          <div>
            <label className="form-label" htmlFor="notes">
              Comments
            </label>
            <textarea
              className="form-control"
              placeholder="Type Comments here"
              id="notes"
              name="notes"
              defaultValue={notes}
              onChange={handleChange}
              style={{ height: "6rem" }}
            ></textarea>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value={sendSms}
              id="checkIndeterminate"
              name="sendSms"
              onChange={handleSendSMS}
              checked={sendSms === 1 ? true : false}
            />
            <label
              className="form-check-label ml-1"
              htmlFor="checkIndeterminate"
            >
              Send SMS to Customer?
            </label>
          </div>
          {apnType === appointmentAction.show && (
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value={isVehiclePurchased}
                id="isVehiclePurchased"
                name="isVehiclePurchased"
                onChange={handleVehiclePurchased}
                checked={isVehiclePurchased === 1 ? true : false}
              />
              <label
                className="form-check-label ml-1"
                htmlFor="isVehiclePurchased"
                style={{ color: "green" }}
              >
                Is vehicle Purchased?
              </label>
            </div>
          )}
        </div>
        {sendSms === 1 && (
          <div>
            <textarea
              className="form-control"
              placeholder="Type Comments here"
              id="message"
              name="message"
              value={message}
              onChange={handleChange}
              style={{ height: "18rem" }}
            ></textarea>
          </div>
        )}
        <div className="d-flex gap-2 flex-row-reverse me-3">
          <button
            type="button"
            className="btn btn-primary btn-hover"
            onClick={() => sendData(popupValues!)}
          >
            <i className="bi bi-bookmark-check text-white me-2"></i>
            Save Changes
          </button>
          <button
            type="button"
            className="btn btn-danger btn-hover"
            onClick={cancelHandler}
          >
            <i className="bi bi-x-circle-fill text-white me-2"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
