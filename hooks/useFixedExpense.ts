import {
  addOrUpdateExpense,
  applyFixedExpensesForGivenMonthAndYear,
  deleteFixedExpense,
  getAllExpensesForGivenYear,
  getAllFixedExpenses,
} from "@/actions/fixed-expense-actions";
import { FixedExpenseDto } from "@/models/inventory/models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const cacheTime = 10 * 60 * 1000;

export const useGetAllFixedExpensesList = () => {
  const { data } = useQuery({
    queryKey: ["AllExpenses"],
    queryFn: getAllFixedExpenses,
  });

  return {
    data,
  };
};

export const useGetAllExpensesForGivenYear = (year: number) => {
  const { data, refetch } = useQuery({
    queryKey: ["AllExpensesForGivenYear", year],
    queryFn: () => getAllExpensesForGivenYear(year),
  });

  return {
    data,
    refetch,
  };
};

export const useApplyFixedExpensesForGivenMonthAndYear = (
  month: string,
  year: number
) => {
  const { data, refetch, isSuccess, isRefetching, status } = useQuery({
    queryKey: ["ApplyExpenses", month, year],
    queryFn: () => applyFixedExpensesForGivenMonthAndYear(month, year),
    enabled: false,
  });

  return {
    data,
    refetch,
    isSuccess,
    isRefetching,
    status,
  };
};

export const useAddOrUpdateFixedExpense = () => {
  const queryClient = useQueryClient();
  const { mutate, isSuccess, data, isPending, status, error, isError } =
    useMutation({
      mutationFn: (data: FixedExpenseDto) => addOrUpdateExpense(data),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["AllExpenses"],
        });
      },
    });

  return {
    addOrUpdateFixedExpense: mutate,
    isSuccess,
    isPending,
    status,
    data,
    error,
    isError,
  };
};

export const useDeleteFixedExpense = () => {
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: (expenseId: number) => deleteFixedExpense(expenseId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["AllExpenses"],
      });
    },
  });

  return {
    deleteFixedExpense: mutate,
  };
};
