import {
  ExpenseType,
  ProfitMargin,
  SalesDataByTypeOfSale,
  SalesOverview,
} from "@/models/inventory/models";
import { baseUrl } from "./added-cost-actions";
import { SaleReportDto } from "@/models/inventory";

export const getSaleReportDataForGivenYear = async (year: number) => {
  let result: SaleReportDto[] = [];
  const response = await fetch(baseUrl + `api/Charts/salereportdata/${year}`);
  if (response.ok) {
    return (result = (await response.json()) as SaleReportDto[]);
  }
  return result;
};

export const getPurchaseDataForGiverYearPurchase = async (year: number) => {
  let result: any[] = [];
  const response = await fetch(
    baseUrl + `api/Charts/stackedbarchartdatapurchase/${year}`
  );
  if (response.ok) {
    return (result = (await response.json()) as any[]);
  }
  return result;
};

export const getPurchaseDataForGiverYearSales = async (year: number) => {
  let result: any[] = [];
  const response = await fetch(
    baseUrl + `api/Charts/stackedbarchartdatasale/${year}`
  );
  if (response.ok) {
    return (result = (await response.json()) as any[]);
  }
  return result;
};

export const getStackedChartSeries = async () => {
  let result: any[] = [];
  const response = await fetch(baseUrl + `api/Charts/stackedchartseries`);
  if (response.ok) {
    return (result = (await response.json()) as any[]);
  }
  return result;
};

export const getSalesBySaleTypeData = async () => {
  let result: SalesDataByTypeOfSale[] = [];

  const response = await fetch(baseUrl + "api/Charts/salesbytype");
  if (response.ok) {
    return (result = await response.json()) as SalesDataByTypeOfSale[];
  }
  return result;
};

export const getSalesOverviewData = async (year: number = 2025) => {
  let result: SalesOverview[] = [];

  const response = await fetch(
    baseUrl + `api/Charts/salesoverview?year=${year}`
  );
  if (response.ok) {
    return (result = await response.json()) as SalesOverview[];
  }
  return result;
};

export const getProfitWIthMarginData = async (year: number = 2025) => {
  let result: ProfitMargin[] = [];

  const response = await fetch(
    baseUrl + `api/Charts/profitwithmargin?year=${year}`
  );
  if (response.ok) {
    return (result = await response.json()) as ProfitMargin[];
  }
  return result;
};

export const getExpensesDataForCurrentMonth = async () => {
  let result: ExpenseType[] = [];

  const response = await fetch(baseUrl + "api/Charts/expenses");
  if (response.ok) {
    return (result = await response.json()) as ExpenseType[];
  }
  return result;
};
