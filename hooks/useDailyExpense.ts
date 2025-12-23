import { getAllDailyExpenses } from "@/actions/daily-expenses-actions";
import { useQuery } from "@tanstack/react-query";

export const useGetAllDailyExpensesList = (year: number) => {
  const { data, refetch } = useQuery({
    queryKey: ["dailyExpenses"],
    queryFn: () => getAllDailyExpenses(year),
  });

  return {
    dailyExpenses: data,
    dailyExpenseRefetch: refetch,
  };
};
