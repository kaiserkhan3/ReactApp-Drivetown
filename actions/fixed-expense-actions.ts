import { ExpensesNewDto, FixedExpenseDto } from "@/models/inventory/models";
import { baseUrl } from "./added-cost-actions";

export const getAllFixedExpenses = async () => {
  let result: FixedExpenseDto[] = [];
  const response = await fetch(baseUrl + `api/FixedExpense/allfixedexpenses`);
  if (response.ok) {
    return (result = (await response.json()) as FixedExpenseDto[]);
  }
  return result;
};

export const getAllExpensesForGivenYear = async (year: number) => {
  let result: ExpensesNewDto[] = [];
  const response = await fetch(
    baseUrl + `api/FixedExpense/expensesforgivenyear/${year}`
  );
  if (response.ok) {
    return (result = (await response.json()) as ExpensesNewDto[]);
  }
  return result;
};

export const applyFixedExpensesForGivenMonthAndYear = async (
  month: string,
  year: number
) => {
  let result: string = "";
  const response = await fetch(
    baseUrl + `api/FixedExpense/applyexpenses/${month}/${year}`
  );
  if (response.ok) {
    return (result = (await response.text()) as string);
  }
  return result;
};

export const addOrUpdateExpense = async (fixedExpense: FixedExpenseDto) => {
  const response = await fetch(
    baseUrl + `api/FixedExpense/addorupdatefixedexpense`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(fixedExpense),
    }
  );
  if (response.ok) {
    return "Record Added successfully";
  }
};

export const addOrUpdateMonthlyExpense = async (
  expensesNewDto: ExpensesNewDto
) => {
  const response = await fetch(
    baseUrl + `api/FixedExpense/addorupdatemonthlyexpense`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expensesNewDto),
    }
  );
  if (response.ok) {
    return "Record Added successfully";
  }
};

export const deleteMonthlyExpense = async (expenseid: number) => {
  let result: string = "";
  const response = await fetch(
    baseUrl + `api/FixedExpense/deletemonthlyexpense/${expenseid}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
  if (response.ok) {
    result = "Record deleted successfully";
    return result;
  }
  return result;
};

export const deleteFixedExpense = async (expenseid: number) => {
  let result: string = "";
  const response = await fetch(
    baseUrl + `api/FixedExpense/deletefixedexpense/${expenseid}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "text/plain",
      },
    }
  );
  if (response.ok) {
    result = "Record deleted successfully";
    return result;
  }
  return result;
};
