"use client";
import React, { useEffect, useRef } from "react";
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import moment from "moment";
import useTable from "../hookComponents/useTable";
import { useInventory } from "@/hooks/useInventory";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";
import { inventoryProps } from "./new-inventory";

const headCells = [
  { id: "details", label: "Vehicle Details" },
  { id: "pDate", label: "Purchase Date" },
  { id: "saleDetails", label: "Sale Details" },
  { id: "customerDetails", label: "Customer Details" },

  { id: "saleType", label: "Sale Type" },
  { id: "title", label: "Title" },
  { id: "inspection", label: "Inspection" },
  { id: "costDetails", label: "Cost Details" },
  { id: "actions", label: "Actions" },
];

function SoldInventoryComponent({
  data,
  fetchNextPage,
  isFetching,
  onEdit,
}: inventoryProps) {
  const tableRef = useRef<HTMLDivElement | null>(null);

  const { TblContainer, TblHead } = useTable(headCells);

  const handleScroll = () => {
    if (
      tableRef.current?.clientHeight! + tableRef.current?.scrollTop! + 1 >=
      tableRef.current?.scrollHeight!
    ) {
      fetchNextPage();
    }
  };
  useEffect(() => {
    tableRef.current?.addEventListener("scroll", handleScroll);

    return () => tableRef.current?.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <TableContainer
        className="shadow-lg px-1 "
        style={{ height: "55vh" }}
        ref={tableRef}
      >
        <TblContainer>
          <TblHead />
          <TableBody className="text-lg">
            {data?.pages?.map((pageData) =>
              pageData?.map((row, index) => (
                <TableRow key={row?.vin! + index}>
                  <TableCell>
                    vin: {row.vin}
                    <br />
                    Make: {row.make} Model: {row.model}
                    <br />
                    Year: {row.iYear} Color: {row.color}
                  </TableCell>
                  <TableCell>
                    Purchase Date:{" "}
                    {moment(row.purchaseDate).format("MM/DD/YYYY")}
                    <br />
                    Purchase From: {row.purchaseFrom}
                  </TableCell>
                  <TableCell>
                    Sold Date: {moment(row.saleDate).format("MM/DD/YYYY")}
                    <br />
                    Sold Type: {row.typeOfSale}
                  </TableCell>
                  <TableCell>
                    Name: {row.customerName}
                    <br />
                    Phone: {row.customerPhoneNumber}
                  </TableCell>

                  <TableCell>{row.typeOfSale}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.isInspection ? "Done" : "Pending"}</TableCell>
                  <TableCell>
                    Original Cost: {row.originalCost}
                    <br />
                    Total Cost: {row.totalCost}
                    <br />
                    Sale Price: {row.salePrice}
                    <br />
                    Profit: {row.profit}
                  </TableCell>
                  <TableCell>
                    <div className="d-flex gap-2">
                      <button type="button" className="btn btn-primary btn-sm">
                        Details
                      </button>
                      <button
                        type="button"
                        onClick={() => onEdit!(row)}
                        className="btn btn-outline-secondary btn-sm"
                      >
                        Edit
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </TblContainer>
      </TableContainer>
      <div className="d-flex justify-content-center">
        {isFetching && <ThreeDotLoader />}
      </div>
    </>
  );
}

export default SoldInventoryComponent;
