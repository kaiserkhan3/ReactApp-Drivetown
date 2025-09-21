import {
  VinData,
  Inventory,
  VehicleMake,
  VehicleModel,
  AddecCostDto,
  RepresentativeDto,
} from "@/models/inventory";
import { baseUrl } from "./added-cost-actions";
import {
  DeleteFile,
  InventoryDocs,
  InventoryImageDto,
  MasterPageData,
  VehcilesCountByOnlineStatus,
} from "@/models/inventory/models";

const pageSize = 20;
export async function getInventoryByStatus(
  status = "Available",
  pageNumber = 1,
  queryParams = ""
) {
  let result: Inventory[] = [];
  const response = await fetch(
    baseUrl +
      `api/Inventory/inventoryByStatus/${status}/${pageNumber - 1}/${pageSize}${queryParams}`
  );
  if (response.ok) {
    return (result = (await response.json()) as Inventory[]);
  }
  return result;
}

export async function getNewVehicleDropdownData() {
  let result: RepresentativeDto[] = [];
  const response = await fetch(
    baseUrl + `api/Inventory/newvehicledropdowndata`
  );
  if (response.ok) {
    return (result = (await response.json()) as RepresentativeDto[]);
  }
  return result;
}

export async function getVinData(vin: string) {
  let result: VinData = {} as VinData;
  const response = await fetch(
    baseUrl + `api/Inventory/possiblemakeandmodelforvin/${vin}`
  );
  if (response.ok) {
    return (result = (await response.json()) as VinData);
  }
  return result;
}

export async function getPossibleKeyNumber() {
  let result: string = "";
  const response = await fetch(baseUrl + `api/Inventory/possiblekeynumber`);
  if (response.ok) {
    return (result = (await response.json()) as string);
  }
  return "";
}

export async function getVehicleMakesList() {
  let result: VehicleMake[] = [];
  const response = await fetch(baseUrl + `api/Inventory/vehiclemakelist`);
  if (response.ok) {
    return (result = (await response.json()) as VehicleMake[]);
  }
  return result;
}

export async function getVehicleModelListByMakeName(make: string) {
  let result: VehicleModel[] = [];
  const response = await fetch(
    baseUrl + `api/Inventory/vehiclemodellist/${make}`
  );
  if (response.ok) {
    result = (await response.json()) as VehicleModel[];
  }
  return result;
}

export async function getInventoryById(id: number = 4662) {
  let result: Inventory = {} as Inventory;
  const response = await fetch(baseUrl + `api/Inventory/inventorybyid/${id}`);
  if (response.ok) {
    result = (await response.json()) as Inventory;
  }
  return result;
}

export async function getInventoryCountByOnlineStatus() {
  let result: VehcilesCountByOnlineStatus = {} as VehcilesCountByOnlineStatus;
  const response = await fetch(
    baseUrl + `api/Inventory/VehcilesCountByOnlineStatus`
  );
  if (response.ok) {
    result = (await response.json()) as VehcilesCountByOnlineStatus;
  }
  return result;
}
export async function getAddedCostDataByInventoryId(id: number) {
  let result: AddecCostDto[] = [];
  const response = await fetch(
    baseUrl + `api/InventoryAddedCost/addedcostdata/${id}`
  );
  if (response.ok) {
    result = (await response.json()) as AddecCostDto[];
  }
  return result;
}

export async function inventoryCUD(data: Inventory) {
  let result: { invntory: Inventory; message: string } = {} as {
    invntory: Inventory;
    message: string;
  };
  const response = await fetch(baseUrl + `api/Inventory/inventorycud`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    result = (await response.json()) as {
      invntory: Inventory;
      message: string;
    };
  }

  return result;
}

export async function uploadInventoryDocuments(formData: FormData) {
  let result: InventoryImageDto[] = [];
  const response = await fetch(
    baseUrl + `api/Inventory/uploadInventoryDocuments`,
    {
      method: "POST",

      body: formData,
    }
  );
  if (response.ok) {
    result = (await response.json()) as InventoryImageDto[];
  }
  return result;
}

export async function getInventoryFiles(data: InventoryDocs) {
  let result: InventoryImageDto[] = [];
  const response = await fetch(baseUrl + `api/Inventory/inventoryfiles`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    result = (await response.json()) as InventoryImageDto[];
  }

  return result;
}

export async function deleteInventoryFile(data: DeleteFile) {
  let result: InventoryImageDto[] = [];
  const response = await fetch(baseUrl + `api/Inventory/deleteInventoryImage`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (response.ok) {
    result = (await response.json()) as InventoryImageDto[];
  }

  return result;
}

export async function getMasterPageData() {
  let result: MasterPageData = {} as MasterPageData;
  const response = await fetch(baseUrl + "api/Inventory/masterpagedata");
  if (response.ok) {
    result = (await response.json()) as MasterPageData;
  }
  return result;
}
