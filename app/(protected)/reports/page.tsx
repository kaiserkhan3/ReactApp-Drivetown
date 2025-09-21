import { PageHeaderCommon } from "@/components/master-page/page-header";
import { PurchaseReportTable } from "@/components/reports/purchase-report-table";
import { ReportTabs } from "@/components/reports/report-tabs";
import { SaleReportContainer } from "@/components/reports/sale-report-container";

export default function SalesReport() {
  return (
    <>
      <PageHeaderCommon />
      <ReportTabs>
        <SaleReportContainer />
        <PurchaseReportTable />
      </ReportTabs>
    </>
  );
}
