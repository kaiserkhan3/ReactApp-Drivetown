import { getUsersWithRoleShortInfo } from "@/actions/server-actions";
import {
  getUserDetailsByUserId,
  getUsersShortInfo,
  UpsertUserCUD,
} from "@/actions/users-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
const cacheTime = 10 * 60 * 1000;

export const useUserData = () => {
  const { data } = useSession();
  let user;
  if (data) {
    user = data.user.result.user;
  }
  const userId = user?.userId;
  const userName = user?.userName;
  const role = user?.urole;

  return { userId, userName, role };
};

export const getUserShortInfohook = () => {
  const { data } = useQuery({
    queryKey: ["UsersShortInfo"],
    queryFn: getUsersShortInfo,
    staleTime: cacheTime,
  });

  return {
    data,
  };
};

export const getUserShortInfoWithRolehook = () => {
  const { data } = useQuery({
    queryKey: ["UsersShortInfo"],
    queryFn: getUsersWithRoleShortInfo,
    staleTime: cacheTime,
  });

  return {
    usersInfo: data,
  };
};

export const useGetUserDetailHook = (userId: number) => {
  const { data, refetch } = useQuery({
    queryKey: ["UserDetails", userId],
    queryFn: () => getUserDetailsByUserId(userId),
    enabled: false,
  });

  return {
    data,
    refetch,
  };
};

export const useUserCUD = () => {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: (formData: any) => UpsertUserCUD(formData),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["UsersShortInfo"],
        });
      },
      onError: (error) => {
        // Handle error
        console.error("Mutation error:", error.message);
      },
    });

  return {
    upsertUser: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};
