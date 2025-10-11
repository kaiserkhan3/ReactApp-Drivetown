import {
  getAllNotifications,
  updateNotificationAsRead,
} from "@/actions/notification-action";
import { NotificationDto } from "@/models/notification.model";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetNotifications = () => {
  const { data, refetch } = useQuery({
    queryKey: ["MasterNotificationsWithReadFlag"],
    queryFn: getAllNotifications,
  });

  return {
    data,
    refetch,
  };
};

export const useUpdateNotificationAsRead = () => {
  const queryClient = useQueryClient();
  const { mutate, isError } = useMutation({
    mutationFn: (data: NotificationDto) => updateNotificationAsRead(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["MasterNotificationsWithReadFlag"],
      });
    },
  });

  return {
    updateNotificationAsRead: mutate,
    isError,
  };
};
