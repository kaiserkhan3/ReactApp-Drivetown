import { getAllDailyExpenses } from "@/actions/daily-expenses-actions";
import { useQuery } from "@tanstack/react-query";

export const useGetAllDailyExpensesList = () => {
  const { data, refetch } = useQuery({
    queryKey: ["dailyExpenses"],
    queryFn: getAllDailyExpenses,
  });

  return {
    dailyExpenses: data,
    dailyExpenseRefetch: refetch,
  };
};
