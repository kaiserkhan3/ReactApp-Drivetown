import { RepresentativeDto } from "@/models/inventory";
import { baseUrl } from "./added-cost-actions";

export const getRepresentativeInfoById = async (id: number) => {
  let result: RepresentativeDto = {} as RepresentativeDto;
  var response = await fetch(
    baseUrl + `api/Representative/representativeinfo/${id}`
  );
  if (response.ok) {
    return (result = (await response.json()) as RepresentativeDto);
  }
  return result;
};

export const createOrUpdateRepresentative = async (data: RepresentativeDto) => {
  let result: string = "";
  var response = await fetch(baseUrl + `api/Representative/representativecud`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (response.ok) {
    return (result = (await response.text()) as string);
  }
  return result;
};
