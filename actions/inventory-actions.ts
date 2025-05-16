import {
  VinData,
  Inventory,
  Representative,
  VehicleMake,
  VehicleModel,
  AddecCostDto,
} from "@/models/inventory";

const pageSize = 20;
export async function getInventoryByStatus(
  status = "Available",
  pageNumber = 1,
  queryParams = ""
) {
  let result: Inventory[] = [];
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL +
      `api/Inventory/inventoryByStatus/${status}/${pageNumber - 1}/${pageSize}${queryParams}`
  );
  if (response.ok) {
    return (result = (await response.json()) as Inventory[]);
  }
  return result;
}

export async function getNewVehicleDropdownData() {
  let result: Representative[] = [];
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL +
      `api/Inventory/newvehicledropdowndata`
  );
  if (response.ok) {
    return (result = (await response.json()) as Representative[]);
  }
  return result;
}

export async function getVinData(vin: string) {
  let result: VinData = {} as VinData;
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL +
      `api/Inventory/possiblemakeandmodelforvin/${vin}`
  );
  if (response.ok) {
    return (result = (await response.json()) as VinData);
  }
  return result;
}

export async function getPossibleKeyNumber() {
  let result: string = "";
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL + `api/Inventory/possiblekeynumber`
  );
  if (response.ok) {
    return (result = (await response.json()) as string);
  }
  return "";
}

export async function getVehicleMakesList() {
  let result: VehicleMake[] = [];
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL + `api/Inventory/vehiclemakelist`
  );
  if (response.ok) {
    return (result = (await response.json()) as VehicleMake[]);
  }
  return result;
}

export async function getVehicleModelListByMakeName(make: string) {
  let result: VehicleModel[] = [];
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL +
      `api/Inventory/vehiclemodellist/${make}`
  );
  if (response.ok) {
    result = (await response.json()) as VehicleModel[];
  }
  return result;
}

export async function getInventoryById(id: number = 4662) {
  let result: Inventory = {} as Inventory;
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL + `api/Inventory/inventorybyid/${id}`
  );
  if (response.ok) {
    result = (await response.json()) as Inventory;
  }
  return result;
}

export async function getAddedCostDataByInventoryId(id: number) {
  let result: AddecCostDto[] = [];
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL +
      `api/InventoryAddedCost/addedcostdata/${id}`
  );
  if (response.ok) {
    result = (await response.json()) as AddecCostDto[];
  }
  return result;
}

export async function inventoryCUD(data: Inventory) {
  let result: Inventory = {} as Inventory;
  const response = await fetch(
    process.env.NEXT_PUBLIC_BASE_API_URL + `api/Inventory/inventorycud`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (response.ok) {
    result = (await response.json()) as Inventory;
  }

  return result;
}
