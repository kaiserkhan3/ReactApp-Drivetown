import { AnnouncementList } from "@/components/admin-tasks/announcement-list";
import { BuyersList } from "@/components/admin-tasks/buyers-list";
import { ContractosList } from "@/components/admin-tasks/contractors-list";
import { MasterTabs } from "@/components/admin-tasks/master-tabs";
import { PurchaseFromList } from "@/components/admin-tasks/purchase-from";
import { SoldByList } from "@/components/admin-tasks/sold-by-list";
import { UsersList } from "@/components/admin-tasks/Users-list";
import { LogFixedExpenses } from "@/components/expenses/log-fixed-expenses";
import { PageHeaderCommon } from "@/components/master-page/page-header";

const MasterComponent = () => {
  return (
    <div>
      <PageHeaderCommon />
      <MasterTabs>
        <UsersList />
        <BuyersList />
        <ContractosList />
        <AnnouncementList />
        <PurchaseFromList />
        <SoldByList />
        <LogFixedExpenses />
      </MasterTabs>
    </div>
  );
};

export default MasterComponent;
