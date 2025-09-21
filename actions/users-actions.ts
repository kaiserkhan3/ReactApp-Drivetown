import { UserDetails, UserShortInfo } from "@/models/inventory/models";
import { baseUrl } from "./added-cost-actions";

export const getUsersShortInfo = async () => {
  let result: UserShortInfo[] = [];
  const response = await fetch(baseUrl + `api/Users/usershortinfo`);
  if (response.ok) {
    return (result = (await response.json()) as UserShortInfo[]);
  }
  return result;
};

export const UpsertUserCUD = async (formData: FormData) => {
  let result: string = "";
  const response = await fetch(baseUrl + `api/Users/usercud`, {
    method: "POST",
    body: formData,
  });
  if (response.ok) {
    return (result = (await response.text()) as string);
  }
  return result;
};

export const getUserDetailsByUserId = async (userId: number) => {
  let result: UserDetails = {} as UserDetails;
  const response = await fetch(baseUrl + `api/Users/userbyuserId/${userId}`);
  if (response.ok) {
    return (result = (await response.json()) as UserDetails);
  }
  return result;
};
