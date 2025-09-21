import { DailyExpenseDto } from "@/models/inventory/models";
import { baseUrl } from "./added-cost-actions";

export const getAllDailyExpenses = async () => {
  let result: DailyExpenseDto[] = [];
  const response = await fetch(baseUrl + `api/DailyExpenses`);
  if (response.ok) {
    return (result = (await response.json()) as DailyExpenseDto[]);
  }
  return result;
};

export const addOrUpdateDailyExpense = async (
  dailyExpense: DailyExpenseDto
) => {
  let result: string = "";
  const response = await fetch(baseUrl + `api/DailyExpenses`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(dailyExpense),
  });
  if (response.ok) {
    return (result = (await response.text()) as string);
  }
};

export const deleteDailyExpense = async (expenseId: number) => {
  let result: string = "";
  const response = await fetch(baseUrl + `api/DailyExpenses/${expenseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "text/plain",
    },
  });
  if (response.ok) {
    result = "Record deleted successfully";
    return result;
  }
  return result;
};
