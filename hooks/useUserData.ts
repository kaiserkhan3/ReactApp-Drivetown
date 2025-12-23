import { getUsersWithRoleShortInfo } from "@/actions/server-actions";
import {
  getUserDetailsByUserId,
  getUsersShortInfo,
  UpsertUserCUD,
} from "@/actions/users-actions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const cacheTime = 10 * 60 * 1000;

export const useUserData = () => {
  let userId = null;
  let userName = null;
  let role = null;
  if (typeof window !== "undefined") {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        // Adjust this path if your user object structure changes
        const user = parsed?.result?.user;
        userId = user?.userId ?? null;
        userName = user?.userName ?? null;
        role = user?.urole?.trim() ?? null;
      } catch (e) {
        // Invalid JSON or structure
        userId = null;
        userName = null;
        role = null;
      }
    }
  }
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
