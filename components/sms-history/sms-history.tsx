"use client";
import { useState } from "react";
import DialogModal from "../control-components/DialogModal";
import { useGetSMSHistory } from "@/hooks/useSmshook";
import { ReplySMS } from "./reply-sms";
import { TwiloMessageDto } from "@/models/twilo-model";
import Link from "next/link";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";

const smsTabs = {
  received: "received",
  delivered: "delivered",
};

export const SMSHistoryComponent = () => {
  const [activeTab, setActiveTab] = useState<string>(smsTabs.received);

  const [repId, setRepId] = useState<number | undefined>(undefined);
  const [showDialog, setShowDialog] = useState(false);
  const [messagesHistory, setMessagesHistory] = useState<TwiloMessageDto[]>([]);
  const [toPhoneNumber, setToPhoneNumber] = useState<string | undefined>(
    undefined
  );

  const { data, refetch } = useGetSMSHistory();
  const editBtnClickHandler = (repId: number) => {
    setRepId(repId);
    setShowDialog(true);
  };

  const handleCreateContractorBtnClick = () => {
    setRepId(undefined);
    setShowDialog(true);
  };

  const replyBtnHandler = (from: string) => {
    const messageHistory =
      data?.filter((f) => f.to === from || f.from === from) || [];
    setMessagesHistory(messageHistory!);
    setToPhoneNumber(from);
    setShowDialog(true);
    console.log("History", history);
  };
  const closeDailogue = () => {
    setShowDialog(false);
  };

  if (!data) {
    return <ThreeDotLoader />;
  }

  return (
    <>
      {showDialog && (
        <DialogModal>
          <ReplySMS
            messages={messagesHistory}
            close={closeDailogue}
            toPhoneNumber={toPhoneNumber!}
          />
        </DialogModal>
      )}
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === smsTabs.received ? "active" : ""}`}
            aria-current="page"
            href="#"
            onClick={() => setActiveTab(smsTabs.received)}
          >
            Received
          </Link>
        </li>
        <li className="nav-item">
          <Link
            className={`nav-link ${activeTab === smsTabs.delivered ? "active" : ""}`}
            href="#"
            onClick={() => setActiveTab(smsTabs.delivered)}
          >
            Delivered
          </Link>
        </li>
      </ul>
      <div className="mt-5 shadow">
        <div className="inventory-list">
          <div className="inventory-table-container table-container">
            <table className="inventory-table table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>SMS Date</th>
                  <th>From</th>
                  <th>To</th>
                  <th>Status</th>
                  <th>Message</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data
                  ?.filter((f) => f.status === activeTab)
                  .map((row, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{`${row.dateCreated}`}</td>
                      <td>{row.from}</td>
                      <td>{row.to}</td>
                      <td>{row.status}</td>
                      <td
                        style={{
                          width: "400px",
                          wordWrap: "break-word",
                          wordBreak: "break-all",
                        }}
                      >
                        {row.body}
                      </td>
                      <td style={{ textAlign: "center", fontSize: "24px" }}>
                        {row.status === "received" && (
                          <button
                            className="btn btn-sm btn-primary btn-icon fs-6"
                            title="Reply"
                            onClick={() => replyBtnHandler(row.from)}
                          >
                            <i className="bi bi-reply-fill"></i>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
