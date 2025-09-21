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
  const { data } = useGetAllExpensesForGivenYear(year);
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

  const savebtnHandler = async (
    row: FixedExpenseDto,
    key: string,
    index: number
  ) => {
    console.log(row);
    const response = await addOrUpdateMonthlyExpense(row);
    handleEditBtnClick(key, index, false);
    toast.success("Saved/updated the record successfully!");
  };

  useEffect(() => {
    if (data!?.length > 0) {
      let expensesFromDb: ExpenseTypes = {
        Salary: data?.filter((i) => i.expenseType === "Salary") || [newRow],
        Rent: data?.filter((i) => i.expenseType === "Rent") || [newRow],
        Marketing: data?.filter((i) => i.expenseType === "Marketing") || [
          newRow,
        ],
        Utilities: data?.filter((i) => i.expenseType === "Utilities") || [
          newRow,
        ],
        OtherExpenses: data?.filter(
          (i) => i.expenseType === "OtherExpenses"
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
        {/* <div className="d-flex gap-4 mb-5 ms-3">
          <div style={{ width: "20rem" }}>
            <GroupControl id="year" label="Salary Year">
              <select
                className="form-select"
                id="year"
                name="year"
                value={selectedYear}
                onChange={(event) => {
                  setSelectedYear(parseInt(event.target.value));
                  setSelectedMonth(moment().format("MMMM"));
                }}
                aria-label="Floating label select example"
              >
                {range(2019, new Date().getFullYear())?.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </GroupControl>
          </div>
          <hr />
          <div style={{ width: "20rem" }}>
            <GroupControl id="month" label="Select Month">
              <select
                className="form-select"
                id="month"
                name="month"
                value={selectedMonth}
                onChange={(event) => setSelectedMonth(event.target.value)}
                aria-label="Floating label select example"
              >
                {months?.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
                <option key="yearlyReport" value="yearlyReport">
                  Yearly Report
                </option>
              </select>
            </GroupControl>
          </div>
          <div>
            <button
              type="button"
              className="btn btn-primary btn-hover"
              onClick={() => setIsConfirmDialogVisible(true)}
            >
              Apply Expenses for{" "}
              <span>{`${selectedYear} ${selectedMonth}`}</span>
            </button>
          </div>
        </div> */}
        <div className="table-container">
          <table className="table " style={{ width: "70vw" }}>
            <thead>
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
                                {/* <td>
                                <input
                                  type="text"
                                  name="expenseType"
                                  defaultValue={key}
                                  readOnly
                                />
                              </td> */}
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
                                <td>{row.amount}</td>
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
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
