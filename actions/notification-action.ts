import { NotificationDto } from "@/models/notification.model";
import { baseUrl } from "./added-cost-actions";

export const getAllNotifications = async () => {
  let result: NotificationDto[] = [];
  const response = await fetch(baseUrl + `api/Inventory/notifications`);
  if (response.ok) {
    return (result = (await response.json()) as NotificationDto[]);
  }
  return result;
};

export const updateNotificationAsRead = async (
  notification: NotificationDto
) => {
  let result = "";
  const response = await fetch(
    baseUrl + `api/Inventory/updatenotificationasread`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notification),
    }
  );
  if (response.ok) {
    return (result = "success");
  }
  return result;
};
