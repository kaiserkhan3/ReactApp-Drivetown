export interface SaleReportDto {
  invenotoryId: number;
  vin: string;
  year: number;
  make: string;
  model: string;
  color: string;
  saleDate: string;
  originalCost: number;
  addedCost: number;
  salePrice: number;
  totalOriginalCost: number;
  profit: number;
  typeOfSale: string;
  soldMonth: string;
  soldYear: number;
}
