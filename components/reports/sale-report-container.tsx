"use client";
import { useGetSaleReportDataForGivenYear } from "@/hooks/useChartsService";
import moment from "moment";
import { useEffect, useState } from "react";
import { SaleReportTable } from "./sale-report-table";
import { GroupControl } from "../control-components/group-control";
import { range } from "@/utilities";
import { useGetAllExpensesForGivenYear } from "@/hooks/useFixedExpense";
import { bookmarkCud } from "@/actions/bookmark-actions";
import { boolean } from "yup";
import DialogModal from "../control-components/DialogModal";
import { ViewAndEditExpenses } from "../expenses/view-edit-expenses";
import { LogFixedExpenses } from "../expenses/log-fixed-expenses";
export const SaleReportContainer = () => {
  const [selectedYear, setSelectedYear] = useState<number>(moment().year());
  const [months, setMonths] = useState<string[]>([]);
  const [selectedMonth, setSelectedMonth] = useState(moment().format("MMMM"));
  const { saleReportData } = useGetSaleReportDataForGivenYear(selectedYear);
  const { data, refetch } = useGetAllExpensesForGivenYear(selectedYear);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);

  const isExpensesAvailableForSelectedMonth = () => {
    return data?.filter((e) => e.expenseMonth === selectedMonth)!?.length > 0;
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

  useEffect(() => {
    getMonths();
  }, [selectedYear]);

  return (
    <>
      {isExpenseModalVisible && (
        <DialogModal minWidth="70vw">
          <div className="p-4">
            <div
              style={{ display: "flex", justifyContent: "end", margin: "10px" }}
            >
              <button
                type="button"
                className="btn btn-sm btn-icon text-danger"
                title="Delete"
                onClick={() => {
                  setIsExpenseModalVisible(false);
                  refetch();
                }}
              >
                <i className="bi bi-x-octagon" style={{ fontSize: "24px" }}></i>
              </button>
            </div>
            {isExpensesAvailableForSelectedMonth() ? (
              <ViewAndEditExpenses month={selectedMonth} year={selectedYear} />
            ) : (
              <LogFixedExpenses month={selectedMonth} year={selectedYear} />
            )}
          </div>
        </DialogModal>
      )}
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
              <option key="yearlyReport" value="yearlyReport">
                Yearly Report
              </option>
            </select>
          </GroupControl>
        </div>
      </div>

      <div className="mt-4 shadow-lg">
        {isExpensesAvailableForSelectedMonth() ? (
          <div className="mb-3 me-5 pt-3" style={{ textAlign: "right" }}>
            <button
              type="button"
              className="btn btn-primary btn-hover"
              onClick={() => setIsExpenseModalVisible(true)}
            >
              View Expenses for the
              <span>{` ${selectedMonth} ${selectedYear}`}</span>
            </button>
          </div>
        ) : (
          <div className="mb-3 me-5 pt-3" style={{ textAlign: "right" }}>
            <button
              type="button"
              className="btn btn-primary btn-hover"
              onClick={() => setIsExpenseModalVisible(true)}
            >
              Add expenses for the
              <span>{` ${selectedMonth} ${selectedYear}`}</span>
            </button>
          </div>
        )}
        <SaleReportTable
          year={selectedYear}
          month={selectedMonth}
          data={
            selectedMonth === "yearlyReport"
              ? saleReportData!
              : saleReportData?.filter(
                  (item) =>
                    item.soldYear === selectedYear &&
                    item.soldMonth === selectedMonth
                )!
          }
        />
      </div>
    </>
  );
};
