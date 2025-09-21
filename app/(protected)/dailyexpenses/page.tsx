import { DailyExpenses } from "@/components/expenses/daily-expense";
import { PageHeaderCommon } from "@/components/master-page/page-header";

export default function DailyExpensesPage() {
  return (
    <>
      <PageHeaderCommon />
      <DailyExpenses />
    </>
  );
}
