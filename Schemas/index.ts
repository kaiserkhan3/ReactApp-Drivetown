import * as Yup from "yup";

export const newVehicleSchema = Yup.object({
  vin: Yup.string()
    .min(9, "Minimum 9 digits required")
    .required("Please enter a Vin"),
  make: Yup.string().required("Please enter a make"),
  model: Yup.string().required("Please enter a modal"),
  color: Yup.string().required("Please enter a color"),
  iYear: Yup.string().required("Please enter a year"),
  originalCost: Yup.number().required("Please enter original cost"),
  buyerId: Yup.number(),
  floorCost: Yup.number(),
  purchaseDate: Yup.date().required("Please select purchase date"),
  purchaseFromId: Yup.number().required("Please select purchase from"),
  keyNo: Yup.number(),
  numberOfKeys: Yup.number().required("Please enter number of keys"),
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
