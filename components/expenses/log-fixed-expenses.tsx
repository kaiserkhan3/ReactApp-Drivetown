"use client";
import {
  useAddOrUpdateFixedExpense,
  useApplyFixedExpensesForGivenMonthAndYear,
  useDeleteFixedExpense,
  useGetAllFixedExpensesList,
} from "@/hooks/useFixedExpense";
import { toast } from "react-toastify";
import { FixedExpenseDto } from "@/models/inventory/models";
import React, { useEffect } from "react";
import { ChangeEvent, useState } from "react";
import { GroupControl } from "../control-components/group-control";
import moment from "moment";
import { range } from "@/utilities";
import DialogModal from "../control-components/DialogModal";
import { ConfirmationDialogue } from "../control-components/ConfirmationDialogue";
import { applyFixedExpensesForGivenMonthAndYear } from "@/actions/fixed-expense-actions";
type ExpenseTypes = {
  Salary: FixedExpenseDto[];
  Rent: FixedExpenseDto[];
  Marketing: FixedExpenseDto[];
  Utilities: FixedExpenseDto[];
  OtherExpenses: FixedExpenseDto[];
};

const newRow: FixedExpenseDto = {
  id: undefined,
  expenseType: "",
  name: "",
  amount: undefined,
  comments: "",
  edit: true,
};

const initialValues: ExpenseTypes = {
  Salary: [newRow],
  Rent: [newRow],
  Marketing: [newRow],
  Utilities: [newRow],
  OtherExpenses: [newRow],
};

type LogFixedExpensesProps = {
  month?: string;
  year?: number;
};

export const LogFixedExpenses = ({ month, year }: LogFixedExpensesProps) => {
  const [selectedYear, setSelectedYear] = useState<number>(
    year || moment().year()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    month || moment().format("MMMM")
  );
  const [months, setMonths] = useState<string[]>([]);
  const [isConfirmDialogVisible, setIsConfirmDialogVisible] = useState(false);
  const { data } = useGetAllFixedExpensesList();
  const { deleteFixedExpense } = useDeleteFixedExpense();
  const { addOrUpdateFixedExpense } = useAddOrUpdateFixedExpense();
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

  const deleteBtnHandler = (
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
      deleteFixedExpense(row.id);
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
        [name as keyof FixedExpenseDto]: value,
      };
      selectedRow.splice(index, 1, editedRow);
      return list;
    });
  };

  const getMonths = () => {
    const currentYear = moment().year();
    const currentMonth = moment().month() + 1;

    if (selectedYear === currentYear) {
      const months = Array.apply(0, Array(currentMonth)).map(function (_, i) {
        return moment(new Date()).month(i).format("MMMM");
      });
      setMonths(months);
    } else {
      const months = Array.apply(0, Array(12)).map(function (_, i) {
        return moment(new Date()).month(i).format("MMMM");
      });
      setMonths(months);
    }
  };

  const handleAddBtnClick = (key: string) => {
    setTableSections((prevState) => {
      let list = { ...prevState };
      let selectedRow = list[key as keyof ExpenseTypes];
      if (Array.isArray(selectedRow)) {
        list[key as keyof ExpenseTypes] = [newRow, ...selectedRow];
      }

      return list;
    });
  };

  const calculateTotals = () => {
    return data?.reduce(
      (acc, currentRow) => acc + Number(currentRow.amount || 0),
      0
    );
  };

  const savebtnHandler = (row: FixedExpenseDto, key: string, index: number) => {
    console.log(row);
    addOrUpdateFixedExpense(row);
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

  const onNobtnClick = () => {
    setIsConfirmDialogVisible(false);
  };

  const onYesButtonClick = async () => {
    const result = await applyFixedExpensesForGivenMonthAndYear(
      selectedMonth,
      selectedYear
    );
    setIsConfirmDialogVisible(false);
    toast.success(result);
  };

  useEffect(() => {
    getMonths();
  }, [selectedYear]);

  return (
    <>
      {isConfirmDialogVisible && (
        <DialogModal>
          <ConfirmationDialogue
            header="Are You Sure?"
            body={`Do you want to apply these expenses for ${selectedMonth} ${selectedYear}?`}
            onNoBtnClick={onNobtnClick}
            onYesBtnClick={onYesButtonClick}
          />
        </DialogModal>
      )}
      <div className="mt-3 shadow-lg rounded pt-3">
        <div className="d-flex gap-4 mb-5 m-3">
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
        </div>
        <div className="table-container m-3">
          <table className="table ">
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
                    {rows.map((row, index) => {
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
              <TotalsRow calculateTotals={calculateTotals} />
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

const TotalsRow = ({
  calculateTotals,
}: {
  calculateTotals: () => number | undefined;
}) => {
  return (
    <tr>
      <th colSpan={2}>Total Expenses:</th>
      <th>{calculateTotals()}</th>
      <th colSpan={2}></th>
    </tr>
  );
};
