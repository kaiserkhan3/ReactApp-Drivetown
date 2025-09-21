import { DashboardContainer } from "@/components/dash-board/dashboard-container";
import ThreeDotLoader from "@/components/loading-control/Three-dots-loader/ThreeDotsLoader";
import { PageHeaderCommon } from "@/components/master-page/page-header";
import { Suspense } from "react";

export default function Dashboard() {
  return (
    <div className="row">
      <div className="col-12 p-5">
        <PageHeaderCommon>
          <div className="btn-group">
            <button type="button" className="btn btn-outline-primary active">
              Today
            </button>
            <button type="button" className="btn btn-outline-primary">
              This Week
            </button>
            <button type="button" className="btn btn-outline-primary">
              This Month
            </button>
            <button type="button" className="btn btn-outline-primary">
              This Year
            </button>
          </div>
        </PageHeaderCommon>
        <Suspense fallback={<ThreeDotLoader />}>
          <DashboardContainer />
        </Suspense>
      </div>
    </div>
  );
}
