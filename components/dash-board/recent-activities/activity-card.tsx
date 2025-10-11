"use client";

import { Appointment } from "@/components/appointments/Appointment";
import DialogModal from "@/components/control-components/DialogModal";
import InventoryDetails from "@/components/inventory-details/InventoryDetails";
import { useState } from "react";

export type ActivityCardData = {
  notificationId: number;
  id: number;
  type: "Inventory" | "Appointment";
  activityDetails: string;
  activityDate: string;
  isRead: boolean;
};

type ActivityCardProps = {
  iconClasses: string;
  header: string;
  data: ActivityCardData[];
  markAsRead: (item: ActivityCardData) => void;
};
export const ActivityCard = ({
  iconClasses,
  header,
  data,
  markAsRead,
}: ActivityCardProps) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalElement, setModalElement] = useState<
    React.ReactElement | undefined
  >(undefined);

  const handleClick = (item: ActivityCardData) => {
    item.type === "Inventory"
      ? setModalElement(
          <InventoryDetails inventoryId={item.id} close={handleClose} />
        )
      : setModalElement(
          <Appointment appointmentId={item.id} close={handleClose} />
        );
    markNotificationAsRead(item);
    setModalVisible(true);
  };

  const handleClose = () => {
    setModalElement(undefined);
    setModalVisible(false);
  };

  const markNotificationAsRead = (item: ActivityCardData) => {
    markAsRead(item);
  };

  return (
    <>
      {modalVisible && <DialogModal top={"3rem"}>{modalElement}</DialogModal>}
      <div style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <div style={{ marginLeft: "20px", marginTop: "10px" }}>
          <i className={iconClasses} style={{ marginRight: "10px" }}></i>{" "}
          {header}
        </div>
        {data?.map((item, index) => (
          <div
            style={{ display: "flex", marginLeft: "20px" }}
            key={item.notificationId + index}
          >
            <div className="activity-icon sale">
              <i className={`bi ${iconClasses}`}></i>
            </div>
            <div style={{ cursor: "pointer" }} className="activity-content">
              <div
                className="activity-details"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginRight: "30px",
                }}
              >
                <span onClick={() => handleClick(item)}>
                  {item?.activityDetails}
                </span>

                <i
                  className="bi bi-eye"
                  style={{ color: "blue", fontSize: "18px" }}
                  title="Mark as read"
                  onClick={() => markNotificationAsRead(item)}
                ></i>
              </div>
              <div className="activity-time">{item?.activityDate}</div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
