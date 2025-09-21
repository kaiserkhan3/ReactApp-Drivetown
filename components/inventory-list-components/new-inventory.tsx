"use client";

import InventoryHeader from "../inventory-header-components/InventoryHeader";
import AvailableInventoryComponent from "./AvailableInventoryComponent";
import SoldInventoryComponent from "./SoldInventoryComponent";
import InventorySearch from "../inventory-header-components/InventorySearch";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { useInventory } from "@/hooks/useInventory";
import { InfiniteData } from "@tanstack/react-query";
import { Inventory } from "@/models/inventory";
import InventoryCardList from "./Inventory-card-list";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";
import DialogModal from "../control-components/DialogModal";
import { Suspense, useState } from "react";
import {
  updateIsDetailViewFlag,
  updateModalCloseState,
} from "@/app/store/modal-slice";
import InventoryDetails from "../inventory-details/InventoryDetails";
import { useUserData } from "@/hooks/useUserData";
import AddEditVehicle from "../new-vehicle/add-edit-vehicle";

export type inventoryProps = {
  data: InfiniteData<Inventory[], unknown> | undefined;
  fetchNextPage: () => void;
  isFetching: boolean;
  onEdit?: (item: Inventory) => void;
  onDetails?: (inventoryId: number) => void;
  onlineLabel?: (onlineDays: string) => { text: string; bgColor: string };
};

export default function NewInventory() {
  const status = useStoreSelector((state) => state.search.status);
  const make = useStoreSelector((state) => state.search.make);
  const year = useStoreSelector((state) => state.search.year);
  const searchText = useStoreSelector((state) => state.search.searchText);
  const modalVisible = useStoreSelector((state) => state.modal.modalVisible);
  const displayType = useStoreSelector((state) => state.search.displayType);
  const isDetailsView = useStoreSelector((state) => state.modal.isDetailsView);
  const onlineStatus = useStoreSelector((state) => state.search.onlineStatus);

  const dispatch = useStoreDispatch();

  const { userId, userName, role } = useUserData();

  const { data, fetchNextPage, isFetching } = useInventory(
    status,
    make,
    year,
    searchText,
    onlineStatus
  );
  const [item, setItem] = useState<Inventory | number | undefined>();

  const onEditHandler = (item: Inventory) => {
    dispatch(updateModalCloseState({ modalVisible: true }));
    dispatch(updateIsDetailViewFlag({ isDetailsView: false }));
    setItem(item);
  };

  const setItemUndefined = () => setItem(undefined);

  const onDetailsHandler = (inventoryId: number) => {
    dispatch(updateModalCloseState({ modalVisible: true }));
    dispatch(updateIsDetailViewFlag({ isDetailsView: true }));
    setItem(inventoryId);
  };

  const configureOnlineLabel = (onlineDays: string) => {
    switch (true) {
      case ["Not online", "Repair Shop", "Whole Sale"].includes(onlineDays):
        return onlineDays === "Not online"
          ? { text: onlineDays, bgColor: "purple" }
          : onlineDays === "Repair Shop"
            ? { text: onlineDays, bgColor: "#290e80" }
            : { text: onlineDays, bgColor: "green" };
      case parseInt(onlineDays) <= 30:
        return { text: `Online (${onlineDays})`, bgColor: "green" };
      case parseInt(onlineDays) > 30 && parseInt(onlineDays) <= 60:
        return { text: `Online (${onlineDays})`, bgColor: "darkblue" };
      case parseInt(onlineDays) > 60:
        return { text: `Online (${onlineDays})`, bgColor: "darkblue" };
      default:
        return { text: `${onlineDays}`, bgColor: "darkblue" };
    }
  };

  return (
    <>
      {modalVisible && (
        <DialogModal top={"1rem"}>
          {isDetailsView ? (
            <InventoryDetails inventoryId={item as number} />
          ) : (
            <AddEditVehicle
              item={item! as Inventory}
              setItemUndefined={setItemUndefined}
            />
          )}
        </DialogModal>
      )}

      {/* <div className="container-fluid p-3 shadow-lg"> */}
      <InventorySearch />
      <InventoryHeader />
      {status === "Available" && displayType === "list" && (
        <AvailableInventoryComponent
          data={data}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          onEdit={onEditHandler}
          onDetails={onDetailsHandler}
        />
      )}
      {(status === "Sold" || status === "Archive") &&
        displayType === "list" && (
          <SoldInventoryComponent
            data={data}
            fetchNextPage={fetchNextPage}
            isFetching={isFetching}
            onEdit={onEditHandler}
            onDetails={onDetailsHandler}
          />
        )}
      {displayType === "grid" && (
        <InventoryCardList
          data={data}
          fetchNextPage={fetchNextPage}
          isFetching={isFetching}
          onEdit={onEditHandler}
          onlineLabel={configureOnlineLabel}
          onDetails={onDetailsHandler}
        />
      )}
      {isFetching && <ThreeDotLoader />}
      {/* </div> */}
    </>
  );
}
