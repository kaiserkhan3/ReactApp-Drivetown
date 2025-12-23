"use client";
import { useEffect, useState } from "react";
import DialogModal from "../control-components/DialogModal";
import { SaleReportDto } from "@/models/inventory";
import moment from "moment";
import InventoryDetails from "../inventory-details/InventoryDetails";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateModalCloseState } from "@/app/store/modal-slice";
import { useGetAllExpensesForGivenYear } from "@/hooks/useFixedExpense";
import { useGetAllDailyExpensesList } from "@/hooks/useDailyExpense";
import { sumDailyExpensesByYearAndMonth } from "@/utilities/daily-expense-utils";

type SaleReportTableProps = {
  data: SaleReportDto[];
  year: number;
  month: string;
};

const tableColumns: string[] = [
  "VIN",
  "YEAR",
  "MAKE",
  "MODEL",
  "COLOR",
  "SALE TYPE",
  "SALE DATE",
  "ORIGNAL COST",
  "ADDED COST",
  "SALE PRICE",
  "TOTAL O-COST",
  "PROFIT",
];

export const SaleReportTable = ({
  data,
  year,
  month,
}: SaleReportTableProps) => {
  const { dailyExpenses, dailyExpenseRefetch } =
    useGetAllDailyExpensesList(year);
  const { data: yearExpenses } = useGetAllExpensesForGivenYear(year);
  const [expenses, setExpenses] = useState(0);
  const [dailyExpensesByMonth, setDailyExpensesByMonth] = useState<string>();
  const modalVisible = useStoreSelector((state) => state.modal.modalVisible);
  const [invId, setInvId] = useState<number | undefined>(undefined);
  const dispatch = useStoreDispatch();

  const onTableRowClick = (invenotoryId: number) => {
    setInvId(invenotoryId);
    dispatch(updateModalCloseState({ modalVisible: true }));
  };

  const calculateTotals = (propName: string) => {
    return data?.reduce(
      (acc, currentRow) =>
        acc + Number(currentRow[propName as keyof SaleReportDto]),
      0
    );
  };

  const calculateExpenseTotals = () => {
    if (month === "yearlyReport") {
      return yearExpenses?.reduce(
        (acc, currentRow) => acc + Number(currentRow.amount || 0),
        0
      );
    }
    return yearExpenses
      ?.filter((i) => i.expenseMonth === month)
      ?.reduce((acc, currentRow) => acc + Number(currentRow.amount || 0), 0);
  };

  useEffect(() => {
    if (yearExpenses) {
      setExpenses(calculateExpenseTotals() as unknown as number);
    }
    if (dailyExpenses && dailyExpenses.length > 0) {
      setDailyExpensesByMonth(
        sumDailyExpensesByYearAndMonth(dailyExpenses, year, month)!?.toFixed(2)
      );
    }
  }, [month, yearExpenses, dailyExpenses]);

  return (
    <>
      {modalVisible && (
        <DialogModal>
          <InventoryDetails inventoryId={invId} />
        </DialogModal>
      )}
      <div className="mt-3 shadow p-4">
        <div className="inventory-list">
          <div className="inventory-table-container table-container">
            <table
              className="inventory-table table table-hover"
              style={{ cursor: "pointer" }}
            >
              <thead>
                <TotalsRow calculateTotals={calculateTotals} />

                <tr>
                  <th>#</th>
                  {tableColumns?.map((col) => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {data?.map((row, index) => (
                  <tr
                    key={row.invenotoryId}
                    onClick={() => onTableRowClick(row.invenotoryId)}
                  >
                    <td>{index + 1}</td>
                    <td>{row.vin}</td>
                    <td>{row.year}</td>
                    <td>{row.make}</td>
                    <td>{row.model}</td>
                    <td>{row.color}</td>
                    <td>{row.typeOfSale}</td>
                    <td>{moment(row.saleDate).format("MM-DD-YYYY")}</td>
                    <td>{`$ ${row.originalCost?.toFixed(2)}`}</td>
                    <td>{`$ ${row.addedCost?.toFixed(2)}`}</td>
                    <td>{`$ ${row.salePrice?.toFixed(2)}`}</td>
                    <td>{`$ ${row.totalOriginalCost.toFixed(2)}`}</td>
                    <td
                      style={{
                        color: `${row.profit < 0 ? "red" : "#2820a0"}`,
                        whiteSpace: "nowrap",
                      }}
                    >{`$ ${row.profit}`}</td>
                  </tr>
                ))}
                <TotalsRow calculateTotals={calculateTotals} />
                <ExpenseRow expenses={expenses} title="Expenses" />
                <ExpenseRow
                  expenses={dailyExpensesByMonth!}
                  title="Expenses from daily log"
                />
                <ExpenseRow
                  expenses={
                    (
                      calculateTotals("profit") -
                      expenses -
                      Number(dailyExpensesByMonth)
                    )?.toFixed(2) as unknown as number
                  }
                  title="Profit"
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const TotalsRow = ({
  calculateTotals,
}: {
  calculateTotals: (propName: string) => number;
}) => {
  return (
    <tr>
      <th colSpan={7}></th>
      <th>Totals</th>
      <th>{`$ ${calculateTotals("originalCost")?.toFixed()}`}</th>
      <th>{`$ ${calculateTotals("addedCost")?.toFixed()}`}</th>
      <th>{`$ ${calculateTotals("salePrice")?.toFixed(2)}`}</th>
      <th>{`$ ${calculateTotals("totalOriginalCost")?.toFixed()}`}</th>
      <th
        style={{
          color: `${calculateTotals("profit") < 0 ? "red" : "green"}`,
          whiteSpace: "nowrap",
        }}
      >{`$ ${calculateTotals("profit")?.toFixed(2)}`}</th>
    </tr>
  );
};

const ExpenseRow = ({
  expenses,
  title,
}: {
  expenses: string | number;
  title: string;
}) => {
  return (
    <tr>
      <th colSpan={11} style={{ textAlign: "right" }}>
        {title}
      </th>
      <th colSpan={2} style={{ textAlign: "right" }}>
        $ {expenses}
      </th>
    </tr>
  );
};
