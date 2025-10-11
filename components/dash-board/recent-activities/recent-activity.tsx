"use client";

import {
  useGetNotifications,
  useUpdateNotificationAsRead,
} from "@/hooks/useNotification";
import { ActivityCard, ActivityCardData } from "./activity-card";
import { useEffect, useMemo, useRef, useState } from "react";
import { NotificationDto } from "@/models/notification.model";
import moment from "moment";

type RecentActivityData = {
  inventoryUpdates: ActivityCardData[];
  inventorySoldRecords: ActivityCardData[];
  inventoryCreated: ActivityCardData[];
  AppointmentsCreated: ActivityCardData[];
  AppointmentsUpdated: ActivityCardData[];
};

const initialValues: RecentActivityData = {
  inventoryUpdates: [],
  inventorySoldRecords: [],
  inventoryCreated: [],
  AppointmentsCreated: [],
  AppointmentsUpdated: [],
};

export const RecentActivity = () => {
  const { data, refetch } = useGetNotifications();
  const { updateNotificationAsRead } = useUpdateNotificationAsRead();
  const [activities, setActivities] =
    useState<RecentActivityData>(initialValues);

  const pushValues = (values: ActivityCardData[], base: ActivityCardData) => {
    const index = values.findIndex(
      (i) => i.notificationId === base.notificationId
    );
    if (index === -1) {
      values.push(base);
    } else {
      values.splice(index, 1, base);
    }
  };

  const buildRecentActivities = (
    data: NotificationDto[]
  ): RecentActivityData => {
    const result: RecentActivityData = { ...initialValues };

    data?.forEach((item) => {
      const {
        notificationMasterId,
        action,
        inventoryId,
        updatedDate,
        inventory,
        category,
        appointment,
        isRead,
      } = item;

      const formattedDate = moment(updatedDate).format("DD-MMM-dddd, h:mm A");

      const base: ActivityCardData = {
        notificationId: notificationMasterId,
        id: inventoryId,
        type: category === 1 ? "Inventory" : "Appointment",
        activityDate: formattedDate,
        activityDetails: action,
        isRead: isRead,
      };

      if (category === 1 && !isRead) {
        if (action.includes("Status Sold")) {
          base.activityDetails = `${inventory?.iYear} ${inventory?.make} ${inventory?.model} Sold to ${inventory?.customerName}`;
          pushValues(result.inventorySoldRecords, base);
        } else if (action.includes("added by")) {
          pushValues(result.inventoryCreated, base);
        } else {
          pushValues(result.inventoryUpdates, base);
        }
      }

      if (category === 2 && !isRead) {
        const baseDetails = `${inventory?.iYear} ${inventory?.make} ${inventory?.model} scheduled appointment for ${appointment?.customerName} ${appointment?.contactNo}`;
        base.activityDetails =
          appointment?.action === "Created"
            ? baseDetails
            : `${baseDetails} updated ${action}`;

        if (appointment?.action === "Created") {
          pushValues(result.AppointmentsCreated, base);
        } else {
          pushValues(result.AppointmentsUpdated, base);
        }
      }
    });
    console.log("Result from build activities", result);
    return result;
  };

  const markAsRead = (item: ActivityCardData) => {
    const notification = data?.find(
      (i) => i.notificationMasterId === item.notificationId
    );
    if (notification) {
      updateNotificationAsRead({
        ...notification,
        isRead: true,
      });
      setTimeout(() => {
        refetch();
      }, 200);
    }
  };

  useEffect(() => {
    if (data && data?.length > 0) {
      setActivities({ ...initialValues });
      console.log("recent activities", data);
      const updated = buildRecentActivities(data);
      setActivities({ ...updated });
    }
  }, [data]);

  return (
    <div className="col-lg-6 mb-4">
      <div className="card">
        <div className="card-header">
          <h5 className="card-title">Recent Activity</h5>
        </div>
        <div className="card-body p-0">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              height: "400px",
              overflow: "auto",
            }}
          >
            {activities?.inventorySoldRecords?.length > 0 && (
              <ActivityCard
                iconClasses="bi bi-cash"
                header="New Sale Completed"
                data={activities.inventorySoldRecords}
                markAsRead={markAsRead}
              />
            )}
            {activities?.inventoryCreated?.length > 0 && (
              <ActivityCard
                iconClasses="bi bi-car-front"
                header="New Vehicle Added to Inventory"
                data={activities.inventoryCreated}
                markAsRead={markAsRead}
              />
            )}
            {activities?.inventoryUpdates?.length > 0 && (
              <ActivityCard
                iconClasses="bi bi-car-front"
                header="Inventory Updates"
                data={activities.inventoryUpdates}
                markAsRead={markAsRead}
              />
            )}
            {activities?.AppointmentsCreated?.length > 0 && (
              <ActivityCard
                iconClasses="bi bi-calendar-check"
                header="Appointments Created"
                data={activities.AppointmentsCreated}
                markAsRead={markAsRead}
              />
            )}
            {activities?.AppointmentsUpdated?.length > 0 && (
              <ActivityCard
                iconClasses="bi bi-calendar-check"
                header="Appoinment Updates"
                data={activities.AppointmentsUpdated}
                markAsRead={markAsRead}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
