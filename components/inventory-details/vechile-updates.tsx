"use client";

import { Inventory, VehicleUpdatesDto } from "@/models/inventory/models";
import moment from "moment";
import { SendSmsButton } from "../master-page/send-sms-button";

type VehicleUpdatesProps = {
  data: VehicleUpdatesDto;
  vehicleDetails: string;
};

export const VehicleUpdates = ({
  data,
  vehicleDetails,
}: VehicleUpdatesProps) => {
  return (
    <div
      className="card shadow-lg shadow-lg p-3  rounded"
      style={{ width: "28rem" }}
    >
      <div className="bg-warning p-2 text-white rounded text-center">
        Vehicle Updates
      </div>
      <div className="card" style={{ fontSize: "12px" }}>
        <div className="card-header p-1">Appointments</div>
        <ul className="list-group list-group-flush">
          {data && data.appointments && data.appointments.length > 0 ? (
            data?.appointments?.map((item) => (
              <li
                key={item.appointmentId}
                className="list-group-item p-1 d-flex"
              >
                <p className="d-flex flex-column">
                  {moment(item.appointmentDate).format("DD-MMM-dddd, h:mm A")}{" "}
                  with {item.customerName} {item.contactNo} {item.notes}{" "}
                  {item.isVehiclePurchased && (
                    <b className="text-success">
                      Recently Marked as Purchased! Consider moving this vehicle
                      to sold status.
                    </b>
                  )}
                </p>
                {item.contactNo?.trim().length === 10 && (
                  <SendSmsButton
                    toNumber={item.contactNo}
                    initialMessage={`Hi ${item.customerName} \n ${vehicleDetails}`}
                    fontSize={12}
                  />
                )}
              </li>
            ))
          ) : (
            <li key="NoAppoiments" className="list-group-item p-1">
              No Appoinments Available
            </li>
          )}
        </ul>
      </div>
      <div className="card" style={{ fontSize: "12px" }}>
        <div className="card-header p-1">Daily Expenses</div>
        <ul className="list-group list-group-flush">
          {data && data.dailyExpenses && data.dailyExpenses.length > 0 ? (
            data?.dailyExpenses?.map((item) => (
              <li key={item.dailyExpenseId} className="list-group-item p-1">
                {`Expense added on ${moment(item.expenseDate).format("DD-MMM-dddd, h:mm A")}
                  Category: ${item.category} Description: ${item.description}
                  Source: ${item.source} Amount: `}
                <span style={{ fontWeight: "bold", color: "red" }}>
                  ${item.amount}
                </span>
                {`${item.notes ? `\n Notes: ${item.notes}` : ""}`}
              </li>
            ))
          ) : (
            <li key="NoExpenses" className="list-group-item p-1">
              No Expenses available
            </li>
          )}
        </ul>
      </div>
      <div className="card" style={{ fontSize: "12px" }}>
        <div className="card-header p-1">Recent Updates</div>
        <ul className="list-group list-group-flush">
          {data && data.notifications && data.notifications.length > 0 ? (
            data?.notifications?.map((item) => (
              <li
                key={item.notificationMasterId}
                className="list-group-item p-1 d-flex"
              >
                {`${moment(item.updatedDate).format("DD-MMM-dddd, h:mm A")}
                ${item.action}
               `}
              </li>
            ))
          ) : (
            <li key="NoChanges" className="list-group-item p-1">
              No Changes available
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};
