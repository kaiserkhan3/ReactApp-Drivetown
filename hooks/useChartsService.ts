import {
  getExpensesDataForCurrentMonth,
  getProfitWIthMarginData,
  getPurchaseDataForGiverYearPurchase,
  getPurchaseDataForGiverYearSales,
  getSaleReportDataForGivenYear,
  getSalesBySaleTypeData,
  getSalesOverviewData,
  getStackedChartSeries,
} from "@/actions/chart-data-actions";
import { useQuery } from "@tanstack/react-query";
const cacheTime = 10 * 60 * 1000;
export const useStackedBarChartSeries = () => {
  const { data } = useQuery({
    queryKey: ["StackedChartSeries"],
    queryFn: getStackedChartSeries,
    staleTime: cacheTime,
  });

  return {
    stackedChartSeries: data,
  };
};

export const useGetSaleReportDataForGivenYear = (year: number) => {
  const { data } = useQuery({
    queryKey: ["SaleReportData", year],
    queryFn: () => getSaleReportDataForGivenYear(year),
    staleTime: cacheTime,
  });

  return {
    saleReportData: data,
  };
};

export const usePurchaseDataForGivenYearPurchase = (year: number) => {
  const { data } = useQuery({
    queryKey: ["PurchseDataForGivenYear", year],
    queryFn: () => getPurchaseDataForGiverYearPurchase(year),
    staleTime: cacheTime,
  });

  return {
    purchseDataForGivenYear: data,
  };
};

export const usePurchaseDataForGivenYearSales = (year: number) => {
  const { data } = useQuery({
    queryKey: ["SalesDataForGivenYear", year],
    queryFn: () => getPurchaseDataForGiverYearSales(year),
    staleTime: cacheTime,
  });

  return {
    saleDataForGivenYear: data,
  };
};

export const useGetSalesDataByType = () => {
  const { data } = useQuery({
    queryKey: ["SalesDataByType"],
    queryFn: getSalesBySaleTypeData,
    staleTime: cacheTime,
  });
  return {
    data,
  };
};

export const useGetExpenseData = () => {
  const { data } = useQuery({
    queryKey: ["ExpenseData"],
    queryFn: getExpensesDataForCurrentMonth,
    staleTime: cacheTime,
  });
  return {
    data,
  };
};

export const useSalesOverviewForGivenYear = (year: number = 2025) => {
  const { data } = useQuery({
    queryKey: ["SalesOverviewForGivenYear", year],
    queryFn: () => getSalesOverviewData(year),
    staleTime: cacheTime,
  });
  return {
    data,
  };
};

export const useProfitWithMarginForGivenYear = (year: number = 2025) => {
  const { data } = useQuery({
    queryKey: ["ProfitMarginForGivenYear", year],
    queryFn: () => getProfitWIthMarginData(year),
    staleTime: cacheTime,
  });
  return {
    data,
  };
};
