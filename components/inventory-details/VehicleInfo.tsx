import { Inventory } from "@/models/inventory";
import defaultImage from "../control-components/defaultCar.png";
import classes from "./inventoryDetails.module.css";
import moment from "moment";

export default function VehicleInfo({ row }: { row: Inventory }) {
  const {
    vin,
    iYear,
    make,
    model,
    imageName,
    color,
    keyNo,
    numberOfKeys,
    purchaseDate,
    purchaseFrom,
    isOnline,
  } = row || {};

  const imageUrl = imageName
    ? `${process.env.NEXT_PUBLIC_SHARED_FOLDER_URL!}vehicle/${imageName}`
    : defaultImage.src;

  return (
    <div className="card shadow-lg" style={{ width: "20rem" }}>
      <div className="card-body">
        <div
          style={{
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: "cover",
            height: "10rem",
            marginBottom: "1rem",
          }}
        ></div>
        <h5 className="card-title">{`${iYear} ${make} ${model}`}</h5>
        <h6 className="card-subtitle mb-2 text-muted">VIN: {vin}</h6>
        <p className={classes.cardText}>Color: {color}</p>
        <p className={classes.cardText}>Key Number: {keyNo}</p>
        <p className={classes.cardText}>Number of Keys: {numberOfKeys}</p>
        {purchaseDate && (
          <p className={classes.cardText}>
            Purchase Date:
            {moment.utc(purchaseDate).format("MM-DD-YYYY")}
          </p>
        )}
        {purchaseFrom && (
          <p className={classes.cardText}>Purchase From: {purchaseFrom}</p>
        )}

        <button type="button" className="btn btn-outline-secondary btn-sm mt-2">
          Edit
        </button>
      </div>
    </div>
  );
}
