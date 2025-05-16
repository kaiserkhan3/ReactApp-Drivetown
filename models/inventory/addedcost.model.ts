export interface AddecCostDto {
  addedCostId: number | undefined;
  inventoryId: number | undefined;
  adate?: string | undefined;
  description?: string | undefined;
  price?: number | undefined;
  contractorId?: number | undefined;
  chequeNo?: number | undefined;
  atype?: string | undefined;
  isPaid?: boolean | undefined;
  addedCostAttachments?: AddedCostImage[];
}

export interface AddedCostImage {
  addedCostImageId: number;
  addedCostId: number;
  imageName: string;
}
