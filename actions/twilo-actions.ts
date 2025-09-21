import { ReplySMSDto, TwiloMessageDto } from "@/models/twilo-model";
import { baseUrl } from "./added-cost-actions";

export const getSMSHistory = async () => {
  let result: TwiloMessageDto[] = [];

  const response = await fetch(baseUrl + `api/Twilo`);
  if (response.ok) {
    return (result = await response.json()) as TwiloMessageDto[];
  }
  return result;
};

export const replySMS = async (data: ReplySMSDto) => {
  let result: string = "";

  const response = await fetch(baseUrl + `api/Twilo`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return (result = await response.text()) as string;
  }
  return result;
};
