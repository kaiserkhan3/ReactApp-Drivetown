"use client";

import { useState } from "react";
import DialogModal from "../control-components/DialogModal";
import { SendSms } from "../sms-history/send-sms";

type SendSmsButtonProps = {
  toNumber?: string;
  initialMessage?: string;
  fontSize?: number;
};

export const SendSmsButton = ({
  toNumber,
  initialMessage,
  fontSize,
}: SendSmsButtonProps) => {
  const [isSendSms, setIsSendSms] = useState(false);
  return (
    <>
      {isSendSms && (
        <DialogModal>
          <SendSms
            close={() => setIsSendSms(false)}
            toNumber={toNumber}
            initialMessage={initialMessage}
          />
        </DialogModal>
      )}
      <button
        type="button"
        title="Send SMS"
        className="btn btn-success btn-icon"
        style={{
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "30px", // optional: ensures consistent size
          height: "30px", // optional: ensures consistent size
          padding: 0, // optional: removes extra spacing
        }}
        onClick={(e) => {
          e.preventDefault();
          setIsSendSms(true);
        }}
      >
        <i
          className="bi bi-envelope"
          style={{ fontSize: `${fontSize}px`, fontWeight: "bold" }}
        ></i>
      </button>
    </>
  );
};
