import { Inventory } from "@/models/inventory";

export const initialValues: Inventory = {
  inventoryId: undefined,

  purchaseDate: new Date("YYYY-MM-DD"),

  vin: "",

  color: "",

  locationFrom: "",

  iYear: undefined,

  vehicleModelId: undefined,
  vehicleMakelId: undefined,

  saleDate: undefined,

  salePrice: undefined,

  soldTo: "",

  typeOfSale: "",

  originalCost: undefined,

  isRegistration: false,

  status: "",

  notes: "",

  isPaid: "",

  bankId: undefined,

  title: "",

  purchaseFromId: undefined,

  soldById: undefined,

  buyerId: undefined,

  floorCost: undefined,

  dealerFee: undefined,

  lotId: 0,

  isOnline: false,

  isInspection: false,

  announcement: "",

  battery: "",

  checkEngineLight: "",

  ac: "",

  windows: "",

  tireLight: "",

  radio: "",

  sunroof: "",

  windsheild: "",

  upholstrey: "",

  cleanliness: "",

  anyLights: "",

  amythingMike: "",

  others: "",

  keyNo: "",

  numberOfKeys: "",

  salePriceCash: undefined,

  salePriceWire: undefined,

  salePriceCheque: undefined,

  salePriceDescription: "",

  salePriceChequeNo: "",

  isLicensePlate: false,

  testDriveId: 0,

  photoUrl: "",

  features: "",

  stock: undefined,

  mileage: undefined,

  createdById: undefined,

  createdDate: undefined,

  updatedById: 0,

  updatedDate: undefined,

  bodyWork: "",

  salePriceZelle: 0,

  isPaymentDone: false,

  firstPaymentDueDate: undefined,

  isPaymentReceived: false,

  isTitleScanned: false,

  isContractScanned: false,

  isAllExpensesAdded: false,

  onlineCost: 0,

  reducedCost: 0,

  customerName: "",

  customerPhoneNumber: undefined,

  titleRegisterationFee: undefined,

  documentFee: undefined,

  saleTax: undefined,

  isWholeSale: undefined,

  isRepairShop: undefined,

  days: undefined,
  onlineDays: "",
  make: "",
  model: "",
  purchaseFrom: "",
  totalOriginalCost: undefined,
  totalAddedCost: undefined,
  profit: undefined,
  soldBy: "",
  imageName: "",
};
