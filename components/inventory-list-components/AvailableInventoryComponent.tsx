"use client";
import React, { useEffect, useRef } from "react";
import { TableBody, TableCell, TableContainer, TableRow } from "@mui/material";
import moment from "moment";
import useTable from "../hookComponents/useTable";
import TourRoundedIcon from "@mui/icons-material/TourRounded";
import ThreeDotLoader from "../loading-control/Three-dots-loader/ThreeDotsLoader";
import { inventoryProps } from "./new-inventory";

const headCells = [
  { id: "days", label: "Days" },
  { id: "onlineDays", label: "Online-Days" },
  { id: "vehicleDetails", label: "Vehicle Details" },
  { id: "purchaseDetails", label: "Purchase Details" },
  { id: "titleStatus", label: "Title Status" },
  { id: "inspectionStatus", label: "Inspection Status" },
  { id: "costDetails", label: "Cost Details" },
  { id: "actions", label: "Actions" },
];

function AvailableInventoryComponent({
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

  const getBgColor = (days?: number): string => {
    let bgColor = "";
    switch (true) {
      case days! < 30:
        bgColor = "#36e34b";
        break;
      case days! > 30 && days! < 60:
        bgColor = "#d17341";
        break;
      case days! > 60:
        bgColor = "#e61607";
        break;
      default:
        bgColor = "#36e34b";
        break;
    }
    return bgColor;
  };

  return (
    <>
      <TableContainer
        className="shadow-lg px-1 "
        ref={tableRef}
        style={{ height: "55vh" }}
      >
        <TblContainer>
          <TblHead />
          <TableBody className="text-lg">
            {data?.pages?.map((pageData) =>
              pageData?.map((row, index) => (
                <TableRow key={row.vin! + index}>
                  <TableCell>
                    {row.days}
                    <TourRoundedIcon sx={{ color: getBgColor(row.days!) }} />
                  </TableCell>
                  <TableCell>
                    {row.onlineDays}{" "}
                    <TourRoundedIcon sx={{ color: getBgColor(row.days!) }} />
                  </TableCell>
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
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    {row.isInspection ? "Done" : "Not Done"}
                  </TableCell>
                  <TableCell>
                    {row.originalCost && row.originalCost !== 0 && (
                      <>
                        Original Cost: {row.originalCost} <br />
                        Total Cost: {row.originalCost}
                      </>
                    )}
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

export default AvailableInventoryComponent;
