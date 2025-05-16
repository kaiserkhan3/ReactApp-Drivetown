import { AddecCostDto } from "@/models/inventory";

const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;

export async function upsertAddedCost(operation: string, formData: FormData) {
  let result: AddecCostDto[] = [];
  const response = await fetch(
    baseUrl + `api/InventoryAddedCost/upsertaddedcost/${operation}`,
    {
      method: "POST",
      body: formData,
    }
  );
  if (response.ok) {
    result = (await response.json()) as AddecCostDto[];
  }
  return result;
}
