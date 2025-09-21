import { BookmarkDto } from "@/models/inventory/models";
import * as Yup from "yup";

export const newVehicleSchema = Yup.object({
  vin: Yup.string()
    .min(9, "Minimum 9 digits required")
    .required("Please enter a Vin"),
  make: Yup.string().required("Please enter a make"),
  model: Yup.string().required("Please enter a modal"),
  color: Yup.string().required("Please enter a color"),
  iYear: Yup.number()
    .typeError("Must be a number")
    .required("Please enter a year"),
  originalCost: Yup.number()
    .typeError("Must be a number")
    .required("Please enter original cost"),
  buyerId: Yup.number().typeError("Must selected a value").notRequired(),
  floorCost: Yup.number().typeError("Must be a number").notRequired(),
  purchaseDate: Yup.date()
    .typeError("Invalid Date")
    .required("Please select purchase date"),
  purchaseFromId: Yup.number().required("Please select purchase from"),
  numberOfKeys: Yup.number().typeError("Must be a number").notRequired(),
  battery: Yup.string().required("Please select battery condition"),
  checkEngineLight: Yup.string().required("Please select chek engine light"),
  ac: Yup.string().required("Please select AC condition"),
  windows: Yup.string().required("Please select windows condition"),
  tireLight: Yup.string().required("Please select tire light condition"),
  radio: Yup.string().required("Please select radio condition"),
  sunroof: Yup.string().required("Please select sunroof condition"),
  windsheild: Yup.string().required("Please select windshield condition"),
  upholstrey: Yup.string().required("Please select upholstrey condition"),
  cleanliness: Yup.string().required("Please select cleanliness condition"),
  others: Yup.string().required("Please select other problem yes or no"),
  bodyWork: Yup.string().required("Please select body condition"),
});

export const addedCostSchema = Yup.object({
  inventoryId: Yup.number().required("Inventory Id is missing"),
  contractorId: Yup.number().required("Select the contractor."),
  price: Yup.number()
    .typeError("Must be a number")
    .required("Enter the Amount"),
});

export const markAsSoldSchema = Yup.object({
  typeOfSale: Yup.string().required("Select Type Of Sale"),
  saleDate: Yup.date().required("Pleas select sale date"),
  soldById: Yup.number().required("Please select refferred by"),
  salePrice: Yup.number()
    .typeError("Must be a number")
    .required("Please enter sale price"),
  isTitleScanned: Yup.boolean()
    .oneOf([true], "Please select title scanned")
    .required("Please select title scanned"),
  isContractScanned: Yup.boolean()
    .oneOf([true], "Please select contract scanned")
    .required("Please select contract scanned"),
  isAllExpensesAdded: Yup.boolean()
    .oneOf([true], "Please select all expense added")
    .required("Please select all expense added"),
  customerName: Yup.string()
    .matches(/^[a-z][A-Z][a-z0-9.-]{0,49}$/, "Name must start with a letter!")
    .required("Customer name is mandatory"),
  customerPhoneNumber: Yup.string().required(
    "Customer phone number is mandatory"
  ),
  orignalCost: Yup.number().typeError("Must be number!"),
});

export const costDetailsSchems = Yup.object({
  salePrice: Yup.number().typeError("Must be a number").notRequired(),
  originalCost: Yup.number().typeError("Must be a number").notRequired(),
  dealerFee: Yup.number().typeError("Must be a number").notRequired(),
  onlineCost: Yup.number().typeError("Must be a number").notRequired(),
  reducedCost: Yup.number().typeError("Must be a number").notRequired(),
});

export const loginSchema = Yup.object({
  userName: Yup.string().required("User Name is Required!"),
  password: Yup.string().required("Password is Required!"),
});

export const appointmentSchema = Yup.object({
  vehicleInfo: Yup.string().required("Select a Vehicle"),
  customerName: Yup.string().required("Customer Name is required!"),
  contactNo: Yup.string().required("Customer Phone Number is required!"),
});

export const todoSchema = Yup.object({
  name: Yup.string().required("Task is required!"),
  description: Yup.string().required("Description is required!"),
  targetDate: Yup.date().required("Target date is required"),
  priority: Yup.string().required("Priority is required"),
  userId: Yup.number().required("User selection is required"),
});

export const CreateUserSchema = Yup.object({
  userName: Yup.string().required("User Name is required!"),
  upassword: Yup.string().required("Password is required!"),
  urole: Yup.string().required("User Role is required"),
  email: Yup.string()
    .email("Invalid Email format!")
    .required("Email is required"),
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  salary: Yup.number().typeError("Must be a number").notRequired(),
});

export const representativeSchema = Yup.object({
  representativeFirstName: Yup.string().required(
    "Contractor name is required!"
  ),
  representativeLastName: Yup.string().required(
    "Organization name is required!"
  ),
  representativeType: Yup.string().required("Representative type is required"),
});
