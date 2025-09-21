"use client";
import { useRepresentative } from "@/hooks/useInventory";
import { useState } from "react";
import DialogModal from "../control-components/DialogModal";
import { SaleReportDto } from "@/models/inventory";
import moment from "moment";
import InventoryDetails from "../inventory-details/InventoryDetails";
import { useStoreDispatch, useStoreSelector } from "@/app/store/hook";
import { updateModalCloseState } from "@/app/store/modal-slice";

type SaleReportTableProps = {
  data: SaleReportDto[];
};

const tableColumns: string[] = [
  "VIN",
  "YEAR",
  "MAKE",
  "MODEL",
  "COLOR",
  "SALE TYPE",
  "SALE DATE",
  "ORIGNAL COST",
  "ADDED COST",
  "SALE PRICE",
  "TOTAL O-COST",
  "PROFIT",
];

export const SaleReportTable = ({ data }: SaleReportTableProps) => {
  const modalVisible = useStoreSelector((state) => state.modal.modalVisible);
  const [invId, setInvId] = useState<number | undefined>(undefined);
  const dispatch = useStoreDispatch();

  const onTableRowClick = (invenotoryId: number) => {
    setInvId(invenotoryId);
    dispatch(updateModalCloseState({ modalVisible: true }));
  };

  const calculateTotals = (propName: string) => {
    return data?.reduce(
      (acc, currentRow) =>
        acc + Number(currentRow[propName as keyof SaleReportDto]),
      0
    );
  };

  return (
    <>
      {modalVisible && (
        <DialogModal>
          <InventoryDetails inventoryId={invId} />
        </DialogModal>
      )}
      <div className="mt-3 shadow p-4">
        <div className="inventory-list">
          <div className="inventory-table-container table-container">
            <table
              className="inventory-table table table-hover"
              style={{ cursor: "pointer" }}
            >
              <thead>
                <TotalsRow calculateTotals={calculateTotals} />

                <tr>
                  <th>#</th>
                  {tableColumns?.map((col) => <th key={col}>{col}</th>)}
                </tr>
              </thead>
              <tbody>
                {data?.map((row, index) => (
                  <tr
                    key={row.invenotoryId}
                    onClick={() => onTableRowClick(row.invenotoryId)}
                  >
                    <td>{index + 1}</td>
                    <td>{row.vin}</td>
                    <td>{row.year}</td>
                    <td>{row.make}</td>
                    <td>{row.model}</td>
                    <td>{row.color}</td>
                    <td>{row.typeOfSale}</td>
                    <td>{moment(row.saleDate).format("MM-DD-YYYY")}</td>
                    <td>{`$ ${row.originalCost}`}</td>
                    <td>{`$ ${row.addedCost}`}</td>
                    <td>{`$ ${row.salePrice}`}</td>
                    <td>{`$ ${row.totalOriginalCost}`}</td>
                    <td
                      style={{
                        color: `${row.profit < 0 ? "red" : "#2820a0"}`,
                        whiteSpace: "nowrap",
                      }}
                    >{`$ ${row.profit}`}</td>
                  </tr>
                ))}
                <TotalsRow calculateTotals={calculateTotals} />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

const TotalsRow = ({
  calculateTotals,
}: {
  calculateTotals: (propName: string) => number;
}) => {
  return (
    <tr>
      <th colSpan={7}></th>
      <th>Totals</th>
      <th>{`$ ${calculateTotals("originalCost")}`}</th>
      <th>{`$ ${calculateTotals("addedCost")}`}</th>
      <th>{`$ ${calculateTotals("salePrice")}`}</th>
      <th>{`$ ${calculateTotals("totalOriginalCost")}`}</th>
      <th
        style={{
          color: `${calculateTotals("profit") < 0 ? "red" : "green"}`,
          whiteSpace: "nowrap",
        }}
      >{`$ ${calculateTotals("profit")}`}</th>
    </tr>
  );
};
