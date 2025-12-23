"use client";

import { replySMS } from "@/actions/twilo-actions";
import { ReplySMSDto } from "@/models/twilo-model";
import { formatPhoneNumber } from "@/utilities";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
type SendSmsProps = {
  close: () => void;
  toNumber?: string;
  initialMessage?: string;
};
export const SendSms = ({ close, toNumber, initialMessage }: SendSmsProps) => {
  const [errorMessage, setErrorMessage] = useState<
    { phoneNumber: string; message: string } | undefined
  >(undefined);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const phoneNumber = formData.get("phoneNumber"); // assuming <input name="name" />
    const message = formData.get("message"); // assuming <input name="email" />
    if (!phoneNumber || !message) {
      if (!phoneNumber || phoneNumber.toString().trim().length !== 10) {
        setErrorMessage({
          phoneNumber: "Phone number must be 10 digits",
          message: errorMessage?.message || "",
        });
      }
      if (!message || message.toString().trim().length === 0) {
        setErrorMessage({
          phoneNumber: errorMessage?.phoneNumber || "",
          message: "Message cannot be empty",
        });
      }
      return;
    }

    setErrorMessage(undefined);
    sendSms(phoneNumber.toString().trim(), message.toString().trim());
  };

  const sendSms = async (phoneNumber: string, body: string) => {
    const smsDto: ReplySMSDto = {
      toPhoneNumber: phoneNumber,
      body: body!,
    };
    const response = await replySMS(smsDto);
    toast.success("Message sent successfully!");
    close();
  };

  return (
    <div style={{ padding: "20px" }}>
      <form className="sms-form" onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">
            +1
          </span>
          <input
            type="text"
            defaultValue={toNumber || ""}
            name="phoneNumber"
            className="form-control"
            placeholder="Phone number"
            aria-label="PhoneNumber"
            aria-describedby="basic-addon1"
          />
        </div>
        {errorMessage?.phoneNumber && (
          <p className="text-danger">{errorMessage.phoneNumber}</p>
        )}
        <label htmlFor="message">Message (max 500 characters)</label>
        <textarea
          id="message"
          name="message"
          maxLength={500}
          defaultValue={initialMessage}
          rows={5}
          className="form-control mb-3"
          placeholder="Type your message here..."
        ></textarea>
        {errorMessage?.message && (
          <p className="text-danger">{errorMessage.message}</p>
        )}
        <div
          style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}
        >
          <button type="submit" className="btn btn-primary btn-hover">
            <i className="bi bi-envelope me-2"></i>
            Send SMS
          </button>
          <button
            type="reset"
            className="btn btn-danger btn-hover"
            onClick={close}
          >
            <i className="bi bi-x-circle-fill me-2"></i>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
