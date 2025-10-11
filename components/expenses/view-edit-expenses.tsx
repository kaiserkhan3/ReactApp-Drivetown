"use client";
import { useGetAllExpensesForGivenYear } from "@/hooks/useFixedExpense";
import { toast } from "react-toastify";
import { ExpensesNewDto, FixedExpenseDto } from "@/models/inventory/models";
import React, { useEffect } from "react";
import { ChangeEvent, useState } from "react";
import moment from "moment";
import {
  addOrUpdateMonthlyExpense,
  deleteMonthlyExpense,
} from "@/actions/fixed-expense-actions";
import { TotalsRow } from "./log-fixed-expenses";

type ExpenseTypes = {
  Salary: ExpensesNewDto[];
  Rent: ExpensesNewDto[];
  Marketing: ExpensesNewDto[];
  Utilities: ExpensesNewDto[];
  OtherExpenses: ExpensesNewDto[];
};

const newRow: ExpensesNewDto = {
  id: undefined,
  expenseType: "",
  name: "",
  amount: undefined,
  comments: "",
  edit: true,
  createDate: undefined,
  expenseMonth: "",
  expenseYear: undefined,
};

const initialValues: ExpenseTypes = {
  Salary: [newRow],
  Rent: [newRow],
  Marketing: [newRow],
  Utilities: [newRow],
  OtherExpenses: [newRow],
};

type ViewAndEditExpensesProps = {
  month: string;
  year: number;
};

export const ViewAndEditExpenses = ({
  month,
  year,
}: ViewAndEditExpensesProps) => {
  const { data, refetch } = useGetAllExpensesForGivenYear(year);
  const [tableSections, setTableSections] =
    useState<ExpenseTypes>(initialValues);

  const handleEditBtnClick = (key: string, index: number, isEdit: boolean) => {
    setTableSections((prevState) => {
      const list = { ...prevState };
      let selectedRow = list[key as keyof ExpenseTypes];
      selectedRow[index].edit = isEdit;
      return list;
    });
  };

  const deleteBtnHandler = async (
    row: FixedExpenseDto,
    key: string,
    index: number
  ) => {
    setTableSections((prevState) => {
      const list = { ...prevState };
      const selectedSectionRows = list[key as keyof ExpenseTypes];
      if (Array.isArray(selectedSectionRows)) {
        list[key as keyof ExpenseTypes] = selectedSectionRows.filter(
          (_, i) => i !== index
        );
      }
      return list;
    });
    if (row.id) {
      await deleteMonthlyExpense(row.id);
      refetch();
      toast.success("Deleted the row successfully!");
    }
  };

  const textChangeHandler = (
    key: string,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number
  ) => {
    const { name, value } = event.target;
    console.log(`${name}: ${value}`);
    setTableSections((prevState) => {
      const list = { ...prevState };
      let selectedRow = list[key as keyof ExpenseTypes];
      let editedRow = {
        ...selectedRow[index],
        expenseType: key,
        expenseMonth: month,
        expenseYear: year,
        createdDate: moment().format("MM-DD-YYYY"),
        [name as keyof FixedExpenseDto]: value,
      };
      selectedRow.splice(index, 1, editedRow);
      return list;
    });
  };

  const handleAddBtnClick = (key: string) => {
    setTableSections((prevState) => {
      let list = { ...prevState };
      let selectedRow = list[key as keyof ExpenseTypes];
      if (Array.isArray(selectedRow)) {
        list[key as keyof ExpenseTypes] = [
          { ...newRow, expenseMonth: month, expenseYear: year },
          ...selectedRow,
        ];
      }
      return list;
    });
  };

  const calculateTotals = () => {
    return data
      ?.filter((i) => i.expenseMonth === month)
      .reduce((acc, currentRow) => acc + Number(currentRow.amount || 0), 0);
  };

  const savebtnHandler = async (
    row: FixedExpenseDto,
    key: string,
    index: number
  ) => {
    const response = await addOrUpdateMonthlyExpense(row);
    handleEditBtnClick(key, index, false);
    refetch();
    toast.success("Saved/updated the record successfully!");
  };

  useEffect(() => {
    if (data!?.length > 0) {
      let expensesFromDb: ExpenseTypes = {
        Salary: data?.filter(
          (i) => i.expenseType === "Salary" && i.expenseMonth === month
        ) || [newRow],
        Rent: data?.filter(
          (i) => i.expenseType === "Rent" && i.expenseMonth === month
        ) || [newRow],
        Marketing: data?.filter(
          (i) => i.expenseType === "Marketing" && i.expenseMonth === month
        ) || [newRow],
        Utilities: data?.filter(
          (i) => i.expenseType === "Utilities" && i.expenseMonth === month
        ) || [newRow],
        OtherExpenses: data?.filter(
          (i) => i.expenseType === "OtherExpenses" && i.expenseMonth === month
        ) || [newRow],
      };
      setTableSections(expensesFromDb);
    }
  }, [data]);

  return (
    <>
      <div
        className="mt-3 shadow-lg rounded pt-3"
        style={{ display: "flex", width: "70vw" }}
      >
        <div className="table-container">
          <table className="table " style={{ width: "70vw" }}>
            <thead>
              <TotalsRow calculateTotals={calculateTotals} />
              <tr>
                <th>#id</th>
                {/* <th>Type</th> */}
                <th>Name</th>
                <th>Amount</th>
                <th>Comments</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(tableSections).map(([key, rows]) => {
                return (
                  <React.Fragment key={key}>
                    <tr key={key}>
                      <th
                        colSpan={6}
                        style={{ backgroundColor: "lightsteelblue" }}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            marginRight: "10rem",
                          }}
                        >
                          <label>{key}</label>
                          <button
                            type="button"
                            className="btn  btn-icon"
                            style={{ fontSize: "28px" }}
                            onClick={() => handleAddBtnClick(key)}
                          >
                            <i className="bi bi-file-earmark-plus-fill"></i>
                          </button>
                        </div>
                      </th>
                    </tr>
                    {rows
                      .filter((f) => f.expenseMonth === month)
                      .map((row, index) => {
                        return (
                          <React.Fragment key={key + index}>
                            {row.edit ? (
                              <tr key={key + "edit" + index}>
                                <td>{index + 1}</td>
                                <td>
                                  <input
                                    type="text"
                                    name="name"
                                    defaultValue={row.name}
                                    onChange={(event) =>
                                      textChangeHandler(key, event, index)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="number"
                                    name="amount"
                                    defaultValue={row.amount}
                                    onChange={(event) =>
                                      textChangeHandler(key, event, index)
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    name="comments"
                                    defaultValue={row.comments}
                                    onChange={(event) =>
                                      textChangeHandler(key, event, index)
                                    }
                                  />
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <button
                                      className="btn btn-sm btn-icon"
                                      title="Save"
                                      onClick={() =>
                                        savebtnHandler(row, key, index)
                                      }
                                    >
                                      <i className="bi bi-floppy"></i>
                                    </button>
                                    <button
                                      className="btn btn-sm btn-icon"
                                      title="Cancel"
                                      onClick={() =>
                                        handleEditBtnClick(key, index, false)
                                      }
                                    >
                                      <i className="bi bi-x-square-fill"></i>
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-icon text-danger"
                                      title="Delete"
                                      onClick={() =>
                                        deleteBtnHandler(row, key, index)
                                      }
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              <tr key={key + "readonly" + index}>
                                <td>{index + 1}</td>
                                {/* <td>{row.expenseType}</td> */}
                                <td>{row.name}</td>
                                <td>$ {row.amount}</td>
                                <td>{row.comments}</td>
                                <td>
                                  <div className="d-flex">
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-icon"
                                      title="Edit"
                                      onClick={() =>
                                        handleEditBtnClick(key, index, true)
                                      }
                                    >
                                      <i className="bi bi-pencil-square"></i>
                                    </button>

                                    <button
                                      type="button"
                                      className="btn btn-sm btn-icon text-danger"
                                      title="Delete"
                                      onClick={() =>
                                        deleteBtnHandler(row, key, index)
                                      }
                                    >
                                      <i className="bi bi-trash"></i>
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      })}
                  </React.Fragment>
                );
              })}
              <TotalsRow calculateTotals={calculateTotals} />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
