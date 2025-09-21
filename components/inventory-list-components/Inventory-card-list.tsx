"use client";
import { inventoryProps } from "./new-inventory";
import InventoryCard from "../control-components/InventoryCard";
import { useEffect, useRef } from "react";

export default function InventoryCardList({
  data,
  fetchNextPage,
  isFetching,
  onEdit,
  onlineLabel,
  onDetails,
}: inventoryProps) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = () => {
    if (
      listRef.current?.clientHeight! + listRef.current?.scrollTop! + 10 >=
      listRef.current?.scrollHeight!
    ) {
      fetchNextPage();
    }
  };

  useEffect(() => {
    listRef.current?.addEventListener("scroll", handleScroll);

    return () => listRef.current?.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      ref={listRef}
      className="d-flex flex-wrap gap-3 mt-3 p-2 justify-content-sm-center justify-content-lg-between"
      style={{
        height: "65vh",
        scrollBehavior: "auto",
        overflow: "auto",
      }}
    >
      {data?.pages?.map((pageData) =>
        pageData?.map((row, index) => (
          <InventoryCard
            key={row.vin! + index}
            title={row.iYear! + " " + row.make! + " " + row.model!}
            color={row.color!}
            vin={row.vin!}
            imageName={row.imageName}
            onlineDays={onlineLabel!(row.onlineDays!)}
            status={row.status}
            onEdit={() => onEdit!(row)}
            onDetails={() => onDetails!(row.inventoryId!)}
          />
        ))
      )}
    </div>
  );
}
