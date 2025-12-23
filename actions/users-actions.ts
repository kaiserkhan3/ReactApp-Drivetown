import { UserDetails, UserShortInfo } from "@/models/inventory/models";
import { baseUrl } from "./added-cost-actions";
import { ResponseDto } from "@/models/user.model";

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

export const authorize = async (credentials: {
  userName: string;
  password: string;
}) => {
  let result: ResponseDto = {} as ResponseDto;
  const res = await fetch(baseUrl + `api/Users/validateuser`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: { "Content-Type": "application/json" },
  });

  // If no error and we have user data, return it
  if (res.ok) {
    return (result = (await res.json()) as ResponseDto);
  }
  // Return null if user data could not be retrieved
  return result;
};
