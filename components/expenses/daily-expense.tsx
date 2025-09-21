"use client";
import { toast } from "react-toastify";
import { DailyExpenseDto, FixedExpenseDto } from "@/models/inventory/models";
import React, { useEffect } from "react";
import { ChangeEvent, useState } from "react";
import moment from "moment";
import { addOrUpdateMonthlyExpense } from "@/actions/fixed-expense-actions";
import { useGetVehicleDataForDropDown } from "@/hooks/useAppointments";
import { useUserData } from "@/hooks/useUserData";
import VehicleInfo from "../inventory-details/VehicleInfo";
import { useGetAllDailyExpensesList } from "@/hooks/useDailyExpense";
import {
  addOrUpdateDailyExpense,
  deleteDailyExpense,
} from "@/actions/daily-expenses-actions";

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
};

export const DailyExpenses = () => {
  const { dailyExpenses, dailyExpenseRefetch } = useGetAllDailyExpensesList();
  const [rows, setRows] = useState<DailyExpenseDto[]>(
    dailyExpenses || [newRow]
  );
  const { refetch, vehiclesDataForDropdown } = useGetVehicleDataForDropDown();
  const { userId } = useUserData();

  const handleEditBtnClick = (index: number, isEdit: boolean) => {
    setRows((prevState) => {
      const list = [...prevState];
      list[index].isEdit = isEdit;
      return list;
    });
  };

  const deleteBtnHandler = async (index: number, row: DailyExpenseDto) => {
    setRows((prevState) => {
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

    row.category = name === "category" ? value : row.category;
    let isDisabled = ![
      "Car Parts",
      "Repair",
      "Transportation",
      "Towing",
    ].includes(row.category);

    setRows((prevState) => {
      let list = [...prevState];
      let editRow = {
        ...row,
        [name as keyof DailyExpenseDto]: value,
        disabled: isDisabled,
      };
      editRow.inventoryId = isDisabled ? undefined : editRow.inventoryId;
      editRow.vehicleInfo = editRow.inventoryId
        ? vehiclesDataForDropdown?.find(
            (f) => f.inventoryId === editRow.inventoryId
          )?.vehicleInfo
        : "";
      editRow.isError =
        !editRow.disabled && !editRow.inventoryId ? true : false;

      list.splice(index, 1, editRow);
      return list;
    });
  };

  const handleAddBtnClick = (position: "Top" | "Bottom") => {
    setRows((prevState) => {
      let list = position === "Top" ? [newRow, ...rows] : [...rows, newRow];
      return list;
    });
  };

  const savebtnHandler = async (row: DailyExpenseDto, index: number) => {
    if (row.inventoryId) {
      row.vehicleInfo = vehiclesDataForDropdown?.find(
        (f) => f.inventoryId === row.inventoryId!
      )?.vehicleInfo;
    } else {
      row.inventoryId = undefined;
      row.vehicleInfo = "";
    }
    if (row.dailyExpenseId) {
      row.updatedBy = userId;
    } else {
      row.createdBy = userId;
    }
    console.log(row);
    if (row.isError) {
      toast.error("Please Select Vehicle");
      return;
    }
    const response = await addOrUpdateDailyExpense(row);
    toast.success(response);
    handleEditBtnClick(index, false);
  };

  useEffect(() => {
    if (dailyExpenses) {
      const expenses = dailyExpenses.map((item) => {
        if (
          !["Car Parts", "Repair", "Transportation", "Towing"].includes(
            item.category
          )
        ) {
          item.disabled = true;
        }

        return item;
      });
      setRows(expenses);
    }
  }, [dailyExpenses]);

  return (
    <>
      <div className="mt-3 shadow-lg rounded pt-3">
        <div className="table-container m-3">
          <table className="table table-striped table-bordered">
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
                <th>Actions</th>
              </tr>
              <tr>
                <th colSpan={10} style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddBtnClick("Top")}
                  >
                    Add New Row on top
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows?.map((row, index) => {
                return (
                  <React.Fragment key={index}>
                    {row.isEdit ? (
                      <tr key={"edit" + row.dailyExpenseId}>
                        <td>{index + 1}</td>
                        <td style={{ width: "60px" }}>
                          <input
                            type="date"
                            name="expenseDate"
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
                            className="form-select"
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
                            {[
                              "Car Parts",
                              "Repair",
                              "Transportation",
                              "Towing",
                              "Office Supplies",
                              "Shop General Expense",
                              "Gas",
                              "Others",
                            ]?.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            className="form-select"
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
                            name="amount"
                            defaultValue={row.amount}
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="text"
                            name="paymentMethod"
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
                            onChange={(event) =>
                              textChangeHandler(event, index, row)
                            }
                          />
                        </td>
                        <td>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-icon"
                              title="Save"
                              disabled={row.isError}
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
                        <td>{row.amount}</td>
                        <td>{row.paymentMethod}</td>
                        <td>{row.notes}</td>
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
              <tr>
                <th colSpan={10} style={{ textAlign: "right" }}>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleAddBtnClick("Bottom")}
                  >
                    Add New Row on bottom
                  </button>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
