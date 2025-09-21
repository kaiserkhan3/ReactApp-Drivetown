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

export interface InventoryImageDto {
  inventoryImageId: number;
  inventoryId: number;
  imageType: string;
  imageName: string;
}

export interface MasterPageData {
  availableVehiclesCount: number;
  appoinmentsCount: number;
  todoListCount: number;
  repairShopCount: number;
  wholesaleCount: number;
  onlineCount: number;
  notOnlineCount: number;
  inspectionCount: number;
  registerationCount: number;
  lessthan30DaysCount: number;
  between3060daysCount: number;
  moreThan60DaysCount: number;
  monthlyProfit: number;
}

export interface SalesDataByTypeOfSale {
  saleType: string;
  percentage: number;
}

export interface InventoryDocs {
  inventoryId: number;
  docTypes: string[];
}

export interface DeleteFile {
  inventoryImageDto: InventoryImageDto;
  docTypes: string[];
}

export interface VehcilesCountByOnlineStatus {
  availableVehicleCount: number;
  soldVehiclesCount: number;
  onlineVehiclesCount: number;
  notOnlineVehicleCount: number;
  repairShopCount: number;
  wholeSaleCount: number;
  vehiclesOnlineBelow30Days: number;
  vehiclesOnlineBetween3060Days: number;
  vehiclesOnlineMoreThan60Days: number;
  wholeSaleSoldCount: number;
  regularSaleSoldCount: number;
}

export interface SalesOverview {
  Wholesale: number;
  Cash: number;
  Finance: number;
  "Total Sales": number;
  Month: string;
}

export interface ExpenseType {
  expenseType: string;
  totalAmount: number;
}

export interface ProfitMargin {
  month: string;
  profit: number;
  profitMargin: number;
}

export interface UserShortInfo {
  userId: number;
  userName: string;
  role: string;
}

export interface BookmarkDto {
  bookmarkId: number | undefined;
  name: string;
  description: string;
  isCompleted: boolean;
  targetDate: Date | string | undefined;
  priority: string;
  comments?: string;
  userId?: number;
  isRead?: boolean;
  createdDate?: Date | string | undefined;
  createdById?: number;
  updatedDate?: Date | string | undefined;
  updatedById?: number;
}

export interface UserDto {
  userId: number | undefined;
  userName: string | undefined;
  upassword: string | undefined;
  urole?: string | undefined;
  lotId?: number | undefined;
  email?: string | undefined;
  firstName?: string | undefined;
  lastName?: string | undefined;
  eaddress?: string | undefined;
  phoneNumber?: string | undefined;
  ssnumber?: string | undefined;
  salaryType?: string | undefined;
  salary?: number | undefined;
  createDate?: Date | undefined;
  updatedDate?: Date | undefined;
  isActive?: boolean | undefined;
  notes?: string | undefined;
}

export interface UserDocument {
  userDocId: number;
  userId: number;
  documentName: string;
  isActive: boolean;
}

export interface UserDetails {
  userDto: UserDto;
  documents: UserDocument[];
}

export interface FixedExpenseDto {
  id: number | undefined;
  expenseType: string;
  name: string;
  comments?: string | undefined;
  amount?: number | undefined;
  createDate?: Date | undefined;
  edit?: boolean;
}

export interface ExpensesNewDto {
  id: number | undefined;
  expenseType: string;
  name: string;
  comments?: string;
  amount?: number | undefined;
  createDate?: Date | undefined;
  expenseMonth?: string;
  expenseYear?: number | undefined;
  edit?: boolean;
}

export interface DailyExpenseDto {
  dailyExpenseId: number | undefined;
  expenseDate?: string;
  category: string;
  inventoryId?: number | undefined;
  vehicleInfo?: string;
  description?: string;
  source: string;
  amount: number | undefined;
  paymentMethod: string;
  notes: string;
  createdBy?: number | undefined;
  createdDate?: Date | undefined;
  updatedBy?: number | undefined;
  updatedDate?: Date | undefined;
  isActive?: boolean;
  disabled?: boolean;
  isEdit?: boolean;
  isError?: boolean;
}
