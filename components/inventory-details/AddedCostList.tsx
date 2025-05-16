import { AddecCostDto } from "@/models/inventory";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
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
    <table className="table table-hover table-bordered">
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
              <CiEdit color="green" onClick={() => editRow(row)} />{" "}
              <MdDeleteForever color="red" onClick={() => deleteRow(row)} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
