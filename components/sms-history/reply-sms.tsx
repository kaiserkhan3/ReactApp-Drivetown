"use client";

import { ReplySMSDto, TwiloMessageDto } from "@/models/twilo-model";
import { GroupControl } from "../control-components/group-control";
import { useState } from "react";
import { replySMS } from "@/actions/twilo-actions";
import { toast } from "react-toastify";

type ReplySMSProps = {
  messages: TwiloMessageDto[];
  close: () => void;
  toPhoneNumber: string;
};

export const ReplySMS = ({ messages, close, toPhoneNumber }: ReplySMSProps) => {
  const [body, setBody] = useState<string>();

  const replyBtnHandler = async () => {
    const smsDto: ReplySMSDto = {
      toPhoneNumber: toPhoneNumber.split("+1")[1],
      body: body!,
    };
    const response = await replySMS(smsDto);
    toast.success("Message sent successfully!");
    close();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        minWidth: "20vw",
        maxWidth: "40vw",
        minHeight: "30vh",
        maxHeight: "80vh",
        overflow: "auto",
        padding: "20px",
      }}
    >
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",

            padding: "5px",
          }}
        >
          {messages?.map((message, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                flexDirection: "column",
                backgroundColor: `${message.status === "delivered" ? "lightgreen" : "lightblue"}`,
                padding: "5px",
                alignItems: `${message.status === "delivered" ? "start" : "end"}`,
              }}
            >
              <div
                style={{
                  margin: 0,
                  marginLeft: `${message.status === "delivered" ? "50px" : ""}`,
                  marginRight: `${message.status === "received" ? "50px" : ""}`,
                  textTransform: "capitalize",
                }}
              >
                {message.status}:
              </div>
              <p
                style={{
                  marginLeft: `${message.status === "delivered" ? "70px" : ""}`,
                  marginRight: `${message.status === "received" ? "40px" : ""}`,
                }}
              >
                {message.body}
              </p>
            </div>
          ))}
          <div className="mt-5">
            <GroupControl id="body" label="Enter Text To Reply">
              <textarea
                className="form-control"
                placeholder="Type address here..."
                id="body"
                name="body"
                style={{ height: "4rem" }}
                onChange={(event) => setBody(event.target?.value)}
              ></textarea>
            </GroupControl>
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 mt-3 justify-content-end">
        <button
          type="button"
          className="btn btn-danger btn-hover"
          onClick={close}
        >
          <i className="bi bi-x"></i> Close
        </button>
        <button
          type="button"
          className="btn btn-primary btn-hover"
          onClick={replyBtnHandler}
        >
          <i className="bi bi-reply-fill"></i> Reply
        </button>
      </div>
    </div>
  );
};
