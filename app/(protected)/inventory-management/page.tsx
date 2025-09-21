import { InventoryPageHeader } from "@/components/inventory-list-components/inventory-page-header";
import NewInventory from "@/components/inventory-list-components/new-inventory";
import ThreeDotLoader from "@/components/loading-control/Three-dots-loader/ThreeDotsLoader";
import { PageHeaderCommon } from "@/components/master-page/page-header";
import { Suspense } from "react";

export default function InventoryManagement() {
  return (
    <>
      <PageHeaderCommon>
        <InventoryPageHeader />
      </PageHeaderCommon>
      <Suspense fallback={<ThreeDotLoader />}>
        <NewInventory />
      </Suspense>
    </>
  );
}
