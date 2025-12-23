"use client";
import { toast } from "react-toastify";
import { DailyExpenseDto } from "@/models/inventory/models";
import React, { useEffect } from "react";
import { ChangeEvent, useState } from "react";
import moment from "moment";
import { useGetVehicleDataForDropDown } from "@/hooks/useAppointments";
import { useUserData } from "@/hooks/useUserData";
import { useGetAllDailyExpensesList } from "@/hooks/useDailyExpense";
import {
  addOrUpdateDailyExpense,
  deleteDailyExpense,
} from "@/actions/daily-expenses-actions";
import { getMonths, range } from "@/utilities";
import { GroupControl } from "../control-components/group-control";
import { getLastOrCurrentDateAsDate } from "@/utilities/daily-expense-utils";
import SearchBox from "../control-components/SearchBox";
import { checkLoginValid } from "@/utilities/check-login-valid";
import { useRouter } from "next/navigation";
import {
  DailyExpensesFileUpload,
  DisplayDialyExpenseUploadedFiles,
} from "./daily-expenses-file-upload";

const newRow: DailyExpenseDto = {
  dailyExpenseId: undefined,
  expenseDate: moment().utc().format("YYYY-MM-DD"),
  category: "",
  inventoryId: undefined,
  vehicleInfo: "",
  description: "",
  amount: undefined,
  notes: "",
  paymentMethod: "",
  source: "",
  disabled: true,
  createdBy: undefined,
  updatedBy: undefined,
  isEdit: true,
  isError: false,
  isAmountError: false,
  rowFiles: undefined,
  attachments: undefined,
};

const fullListCategories = [
  "Car Parts",
  "Repair",
  "Transportation",
  "Towing",
  "Office Supplies",
  "Shop General Expense",
  "Gas",
  "Others",
];
const expensesCategoriesWithVehicle = [
  "Car Parts",
  "Repair",
  "Transportation",
  "Towing",
];

export const DailyExpenses = () => {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState<number>(moment().year());
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM"));
  const { dailyExpenses, dailyExpenseRefetch } = useGetAllDailyExpensesList(
    selectedYear || moment().year()
  );
  const [rows, setRows] = useState<DailyExpenseDto[]>(
    dailyExpenses || [newRow]
  );
  const [filteredRows, setFilteredRows] = useState<DailyExpenseDto[]>(
    dailyExpenses || [newRow]
  );
  const { refetch, vehiclesDataForDropdown } = useGetVehicleDataForDropDown();
  const { userId } = useUserData();

  const calculateTotals = () => {
    const total = Array.isArray(filteredRows)
      ? filteredRows.reduce((acc, cur) => acc + (Number(cur.amount) || 0), 0)
      : 0;

    return total.toFixed(2);
  };

  const handleEditBtnClick = (index: number, isEdit: boolean) => {
    setFilteredRows((prevState) => {
      const list = [...prevState];
      list[index].isEdit = isEdit;
      return list;
    });
  };

  const deleteBtnHandler = async (index: number, row: DailyExpenseDto) => {
    setFilteredRows((prevState) => {
      const list = [...prevState];
      list.splice(index, 1);
      return list;
    });
    if (row.dailyExpenseId) {
      const response = await deleteDailyExpense(row.dailyExpenseId);
      toast.success("Record deleted successfully!");
    }
  };

  const textChangeHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    index: number,
    row: DailyExpenseDto
  ) => {
    const { name, value } = event.target;

    setFilteredRows((prev) =>
      prev.map((r, i) => {
        if (i !== index) return r;

        const updated: DailyExpenseDto = {
          ...r,
          [name as keyof DailyExpenseDto]: value as any,
        } as DailyExpenseDto;

        // when category changes determine disabled state
        const currentCategory =
          name === "category" ? (value as string) : updated.category;
        updated.disabled =
          !expensesCategoriesWithVehicle.includes(currentCategory);

        // when inventory changes, copy the selected option text into vehicleInfo
        if (name === "inventoryId") {
          const select = event.target as HTMLSelectElement;
          updated.vehicleInfo =
            select.options[select.selectedIndex]?.text || "";
        }

        updated.isError =
          !updated.disabled && !updated.inventoryId ? true : false;
        updated.isAmountError =
          !updated.amount || updated.amount <= 0 ? true : false;
        return updated;
      })
    );
  };

  const handleAddBtnClick = (position: "Top" | "Bottom") => {
    setFilteredRows((prevState) => {
      const newEditedRow = {
        ...newRow,
        expenseDate:
          getLastOrCurrentDateAsDate(selectedMonth, selectedYear) ||
          moment().utc().format("YYYY-MM-DD"),
      };
      let list =
        position === "Top"
          ? [newEditedRow, ...prevState]
          : [...prevState, newEditedRow];
      return list;
    });
  };

  const savebtnHandler = async (row: DailyExpenseDto, index: number) => {
    if (!row.inventoryId) {
      row.vehicleInfo = "";
    }
    if (row.dailyExpenseId) {
      row.updatedBy = userId;
    } else {
      row.createdBy = userId;
    }
    const formData = new FormData();
    row.rowFiles?.forEach((file) => {
      formData.append("files", file);
    });

    formData.append("data", JSON.stringify(row));
    if (row.isError) {
      toast.error("Please Select Vehicle");
      return;
    }
    if (row.isAmountError) {
      toast.error("Please enter valid Amount");
    }

    const response = await addOrUpdateDailyExpense(formData);
    dailyExpenseRefetch();
    toast.success(response);
    handleEditBtnClick(index, false);
  };

  const fileUploadHandler = async (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const files = event.target?.files;
    if (!files || files.length === 0) return;

    const filesArray = Array.from(files);

    // update rows immutably so React re-renders and file names show
    setFilteredRows((prev) =>
      prev.map((r, i) =>
        i === index
          ? { ...r, rowFiles: [...(r.rowFiles || []), ...filesArray] }
          : r
      )
    );
  };

  const onSearchHandler = (event: ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event?.target?.value?.toLowerCase().trim();

    if (!searchTerm) {
      setFilteredRows(rows);
      return;
    }

    const filtered = (filteredRows || [])
      .filter(
        (i) =>
          moment(i.expenseDate).year() === selectedYear &&
          moment(i.expenseDate).format("MMMM") === selectedMonth
      )
      .filter((item) => {
        const fieldsToSearch = [
          item.category,
          item.vehicleInfo,
          item.description,
          item.source,
          item.notes,
          item.paymentMethod,
          item.amount !== undefined ? String(item.amount) : "",
        ];

        return fieldsToSearch.some((f) =>
          (f || "").toString().toLowerCase().includes(searchTerm)
        );
      })
      .map((it) => {
        if (!expensesCategoriesWithVehicle.includes(it.category)) {
          it.disabled = true;
        }
        return it;
      });

    setFilteredRows(filtered.length ? filtered : rows);
  };

  useEffect(() => {
    setMonths(getMonths(selectedYear));
  }, [selectedYear]);

  useEffect(() => {
    if (dailyExpenses) {
      const expenses = dailyExpenses
        .filter((i) => moment(i.expenseDate).format("MMMM") === selectedMonth)
        .map((item) => {
          if (!expensesCategoriesWithVehicle.includes(item.category)) {
            item.disabled = true;
          }

          return item;
        });
      setRows(expenses);
      setFilteredRows(expenses);
    }
  }, [dailyExpenses, selectedMonth]);

  return (
    <>
      <div className="d-flex gap-4 mt-4 shadow rounded p-2 pt-3">
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
            </select>
          </GroupControl>
        </div>
      </div>
      <div className="mt-3 shadow-lg rounded pt-3">
        <div className="table-container m-3">
          <table
            className="table table-striped table-bordered"
            style={{ fontSize: "14px" }}
          >
            <thead>
              <tr>
                <th>#id</th>
                <th style={{ width: "120px" }}>Date</th>
                <th style={{ width: "120px" }}>Category</th>
                <th style={{ width: "180px" }}>Vehicle</th>
                <th>Description</th>
                <th>Source</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Notes</th>
                <th>Recipts</th>
                <th>Actions</th>
              </tr>
              <tr>
                <th colSpan={9} style={{ textAlign: "center" }}>
                  <SearchBox
                    placeholder="Enter search term..."
                    center={true}
                    onChange={onSearchHandler}
                  />
                </th>
                <th
                  colSpan={2}
                  style={{ textAlign: "right", borderLeft: "none" }}
                >
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddBtnClick("Top")}
                    disabled={filteredRows.some((r) => r.isEdit)}
                  >
                    <i className="bi bi-plus-circle text-white me-2"></i>
                    Add New Row on top
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows?.map((row, index) => {
                return (
                  <React.Fragment key={index}>
                    {row.isEdit ? (
                      <tr key={"edit" + row.dailyExpenseId}>
                        <td>{index + 1}</td>
                        <td style={{ width: "60px" }}>
                          <input
                            type="date"
                            name="expenseDate"
                            className="form-control-sm"
                            value={
                              moment(row.expenseDate)
                                .utc()
                                .format("YYYY-MM-DD") ||
                              moment().utc().format("YYYY-MM-DD")
                            }
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                        </td>
                        <td>
                          <select
                            className="form-select form-select-sm"
                            id="category"
                            name="category"
                            value={row.category}
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                            aria-label="Floating label select example"
                          >
                            <option key="selectcategory" value="">
                              Select Category
                            </option>
                            {fullListCategories?.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select from-select-sm"
                            id="inventoryId"
                            name="inventoryId"
                            style={{ width: "140px" }}
                            disabled={row.disabled}
                            value={row.inventoryId || undefined}
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                            aria-label="Floating label select example"
                          >
                            <option key="selectcar" value={undefined}>
                              Select Vehicle
                            </option>
                            {vehiclesDataForDropdown?.map((v) => (
                              <option key={v.inventoryId} value={v.inventoryId}>
                                {v.vehicleInfo}
                              </option>
                            ))}
                          </select>
                          {row.isError && (
                            <p className="text-danger">Please Select</p>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            className="form-control-sm"
                            name="description"
                            placeholder="Enter Description"
                            defaultValue={row.description}
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="source"
                            className="form-control-sm"
                            placeholder="Enter Source"
                            defaultValue={row.source}
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                        </td>
                        <td>
                          <input
                            style={{ width: "70px" }}
                            type="number"
                            className="form-control-sm"
                            name="amount"
                            defaultValue={row.amount}
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                          {row.isAmountError && (
                            <p className="text-danger">Amount</p>
                          )}
                        </td>
                        <td>
                          <input
                            type="text"
                            name="paymentMethod"
                            className="form-control-sm"
                            placeholder="Enter Payment Method"
                            defaultValue={row.paymentMethod}
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="notes"
                            placeholder="Enter notes if any..."
                            defaultValue={row.notes}
                            className="form-control-sm"
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                        </td>
                        <td style={{ textAlign: "start" }}>
                          <DailyExpensesFileUpload
                            row={row}
                            handleChange={(e) => fileUploadHandler(e, index)}
                          />
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-icon"
                              title="Save"
                              disabled={
                                row.isError ||
                                row.isAmountError ||
                                !row.category
                              }
                              onClick={() => savebtnHandler(row, index)}
                            >
                              <i className="bi bi-floppy"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-icon"
                              title="Cancel"
                              onClick={() => handleEditBtnClick(index, false)}
                            >
                              <i className="bi bi-x-square-fill"></i>
                            </button>
                            <button
                              type="button"
                              className="btn btn-sm btn-icon text-danger"
                              title="Delete"
                              onClick={() => deleteBtnHandler(index, row)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{moment(row.expenseDate).format("MM-DD-YYYY")}</td>
                        <td style={{ width: "120px" }}>{row.category}</td>
                        <td style={{ width: "140px" }}>{row.vehicleInfo}</td>
                        <td style={{ width: "140px" }}>{row.description}</td>
                        <td>{row.source}</td>
                        <td>{`$ ${row.amount}`}</td>
                        <td>{row.paymentMethod}</td>
                        <td>{row.notes}</td>
                        <td style={{ textAlign: "center" }}>
                          <DisplayDialyExpenseUploadedFiles
                            attachment={row.attachments! || undefined}
                          />
                        </td>
                        <td>
                          <div className="d-flex">
                            <button
                              type="button"
                              className="btn btn-sm btn-icon"
                              title="Edit"
                              onClick={() => handleEditBtnClick(index, true)}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>

                            <button
                              type="button"
                              className="btn btn-sm btn-icon text-danger"
                              title="Delete"
                              onClick={() => deleteBtnHandler(index, row)}
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
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={6} className="text-danger">
                  Totals:
                </th>
                <th className="text-danger">$ {calculateTotals()}</th>
                <th colSpan={3} style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddBtnClick("Bottom")}
                    disabled={filteredRows.some((r) => r.isEdit)}
                  >
                    <i className="bi bi-plus-circle text-white me-2"></i>
                    Add New Row on bottom
                  </button>
                </th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </>
  );
};
