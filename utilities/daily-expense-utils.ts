import { DailyExpenseDto } from "@/models/inventory/models";
import moment from "moment";

export function sumDailyExpensesByYearAndMonth(
  expenses: DailyExpenseDto[] | undefined,
  year: number,
  month: string // 1-12
) {
  if (!expenses || expenses.length === 0) return 0;

  return expenses
    ?.filter((i) => !i.inventoryId)
    .reduce((acc, cur) => {
      if (!cur || !cur.expenseDate) return acc;
      if (month !== "yearlyReport") {
        const d = new Date(cur.expenseDate);
        if (d.getFullYear() === year && moment(d).format("MMMM") === month) {
          return acc + Number(cur.amount || 0);
        }
      } else {
        return acc + Number(cur.amount || 0);
      }

      return acc;
    }, 0);
}

/**
 * Return the last date of the given month (by name 'MMMM') for the year.
 * If the given month is the current month (in the same year), returns today's date.
 * @param monthName - e.g. 'March'
 * @param year - full year number
 */
export function getLastOrCurrentDateForMonth(
  monthName: string,
  year: number
): moment.Moment | null {
  const now = moment();
  const parsed = moment(`${monthName} ${year}`, "MMMM YYYY", true);
  if (!parsed.isValid()) return null;

  if (parsed.year() === now.year() && parsed.month() === now.month()) {
    return now;
  }

  return parsed.endOf("month");
}

/**
 * Return the last date of the given month as a local date string 'YYYY-MM-DD'.
 * This avoids timezone/ISO shifts where the end-of-month moment in local time
 * becomes the next day when converted to UTC/ISO.
 */
export function getLastOrCurrentDateString(monthName: string, year: number) {
  const m = getLastOrCurrentDateForMonth(monthName, year);
  if (!m) return null;
  // format in local time so callers see the expected calendar date
  return m.format("YYYY-MM-DD");
}

/**
 * Return the last date of the given month as a JS Date at local midnight.
 * Useful when you need a Date object representing the calendar day.
 */
export function getLastOrCurrentDateAsDate(monthName: string, year: number) {
  const s = getLastOrCurrentDateString(monthName, year);
  if (!s) return null;
  // new Date('YYYY-MM-DD') creates a Date at local midnight in modern browsers
  return moment(s).format("YYYY-MM-DD");
}
