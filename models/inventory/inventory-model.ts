export interface Inventory {
  inventoryId: number | undefined;

  purchaseDate: Date | null;

  vin?: string;

  color?: string;

  locationFrom?: string;

  iYear?: number | undefined;

  vehicleModelId?: number;
  vehicleMakelId?: number;

  saleDate?: Date;

  salePrice?: number;

  soldTo?: string;

  typeOfSale?: string;

  originalCost?: number;

  isRegistration?: boolean;

  status?: string;

  notes?: string;

  isPaid?: string;

  bankId?: number;

  title?: string;

  purchaseFromId?: number;

  soldById?: number;

  buyerId?: number;

  floorCost?: number;

  dealerFee?: number;

  lotId?: number;

  isOnline?: boolean;

  isInspection?: boolean;

  announcement?: string;

  battery?: string;

  checkEngineLight?: string;

  ac?: string;

  windows?: string;

  tireLight?: string;

  radio?: string;

  sunroof?: string;

  windsheild?: string;

  upholstrey?: string;

  cleanliness?: string;

  anyLights?: string;

  amythingMike?: string;

  others?: string;

  keyNo?: string;

  numberOfKeys?: string;

  salePriceCash?: number;

  salePriceWire?: number;

  salePriceCheque?: number;

  salePriceDescription?: string;

  salePriceChequeNo?: string;

  isLicensePlate?: boolean;

  testDriveId: number;

  photoUrl?: string;

  features?: string;

  stock?: number;

  mileage?: number;

  createdById?: number;

  createdDate?: Date;

  updatedById?: number;

  updatedDate?: Date;

  bodyWork?: string;

  salePriceZelle?: number;

  isPaymentDone?: boolean;

  firstPaymentDueDate?: Date;

  isPaymentReceived?: boolean;

  isTitleScanned?: boolean;

  isContractScanned?: boolean;

  isAllExpensesAdded?: boolean;

  onlineCost?: number;

  reducedCost?: number;

  customerName?: string;

  customerPhoneNumber?: string;

  titleRegisterationFee?: number;

  documentFee?: number;

  saleTax?: number;

  isWholeSale?: boolean;

  isRepairShop?: boolean;

  days?: number;
  onlineDays?: string;
  make?: string;
  model?: string;
  purchaseFrom?: string;
  totalOriginalCost?: number;
  totalAddedCost?: number;
  profit?: number;
  soldBy?: string;
  imageName?: string;
}
