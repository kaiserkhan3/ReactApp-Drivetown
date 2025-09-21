import { ISMSTemplateDto, ITemplate } from "@/models/message-template";
import { baseUrl } from "./added-cost-actions";
import { json } from "stream/consumers";

export const getMessageTemplates = async () => {
  let result: ISMSTemplateDto = {} as ISMSTemplateDto;
  const response = await fetch(baseUrl + `api/MessageTemplate`);
  if (response.ok) {
    return (result = (await response.json()) as ISMSTemplateDto);
  }
  return result;
};

export async function upsertSMSTemplate(data: ITemplate) {
  const response = await fetch(baseUrl + `api/MessageTemplate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return true;
  }
  return false;
}
