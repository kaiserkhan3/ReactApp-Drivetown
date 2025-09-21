"use server";
import { UserShortInfo } from "@/../../models/inventory/models";
const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export const getUsersWithRoleShortInfo = async () => {
  let result: UserShortInfo[] = [];
  const response = await fetch(baseUrl + `api/Users/usershortinfo`);
  if (response.ok) {
    return (result = (await response.json()) as UserShortInfo[]);
  }
  return result;
};
