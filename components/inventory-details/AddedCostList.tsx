import { AddecCostDto } from "@/models/inventory";
import moment from "moment";

type AddedCostListProps = {
  rows: AddecCostDto[];
  editRow: (row: AddecCostDto) => void;
  deleteRow: (row: AddecCostDto) => void;
};

export default function AddedCostList({
  rows,
  editRow,
  deleteRow,
}: AddedCostListProps) {
  return (
    <div
      className="table-container shadow-lg mb-3"
      style={{ maxHeight: "300px", minWidth: "30rem", maxWidth: "40rem" }}
    >
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Description</th>
            <th scope="col">Date</th>
            <th scope="col">Price</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {rows?.map((row) => (
            <tr key={row.addedCostId}>
              <th scope="row">{row.description}</th>
              <td scope="row">
                {moment(row.adate?.slice(0, 10)).format("MM-DD-YYYY")}
              </td>
              <td scope="row">{row.price}</td>
              <td>
                <div className="d-flex gap-3">
                  <i
                    className="bi bi-pencil-fill"
                    style={{ cursor: "pointer", fontSize: "20px" }}
                    onClick={() => editRow(row)}
                  ></i>
                  <i
                    className="bi bi-trash3-fill text-danger"
                    style={{ fontSize: "20px", cursor: "pointer" }}
                    onClick={() => deleteRow(row)}
                  ></i>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
