import { appointmentAction } from "@/models/Appoinments";
import { ChangeEvent, useEffect, useState } from "react";

type SendMessageProps = {
  notes: string;
  message: string;
  apnType: string;
  sendData: (values: ReturnValuesType) => void;
};
export type ReturnValuesType = {
  notes?: string;
  message: string;
  sendSms: boolean;
};
export function SendMessage({
  notes,
  message,
  apnType,
  sendData,
}: SendMessageProps) {
  const [sendSms, setSendSms] = useState(0);
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
    console.log("sene sms ", event.target.value);
    setSendSms(() => (parseInt(event.target.value) === 0 ? 1 : 0));
    setPopupValues((preState) => {
      return {
        ...preState!,
        sendSms: parseInt(event.target.value) === 0 ? true : false,
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

        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value={sendSms}
            id="checkIndeterminate"
            onChange={handleSendSMS}
            checked={sendSms === 1 ? true : false}
          />
          <label className="form-check-label" htmlFor="checkIndeterminate">
            Send SMS to Customer?
          </label>
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
        <div>
          <button
            type="button"
            className="btn btn-primary btn-hover"
            onClick={() => sendData(popupValues!)}
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
