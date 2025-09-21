"use client";
import defaultImage from "./defaultCar.png";
import { PiGasPumpFill } from "react-icons/pi";
import { IoColorPaletteOutline } from "react-icons/io5";

type InventoryCardProps = {
  imageName?: string;
  title: string;
  vin: string;
  color: string;
  status?: string;
  onlineDays?: { text: string; bgColor: string };
  onEdit?: () => void;
  onDetails?: () => void;
};

export default function InventoryCard({
  imageName,
  title,
  vin,
  color,
  status,
  onlineDays,
  onEdit,
  onDetails,
}: InventoryCardProps) {
  const imageUrl = imageName
    ? process.env.NEXT_PUBLIC_VEHICLE_IMAGE_BASE_URL! + imageName
    : defaultImage.src;

  return (
    <div className="card" style={{ width: "15rem" }}>
      <div
        className="d-flex flex-grow-1 justify-content-lg-between text-center p-1"
        style={{
          height: "10rem",
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          color: "#fff",
          fontSize: "0.8rem",
        }}
      >
        <span
          className={`p-1 mt-1 rounded ${status === "Sold" ? "bg-success" : "bg-warning"}`}
          style={{ height: "1.8rem", textAlign: "center" }}
        >
          {status}
        </span>
        {onlineDays?.text && (
          <p
            className={`p-1 mt-1 rounded }`}
            style={{
              color: "#fff",
              height: "1.8rem",
              backgroundColor: `${onlineDays?.bgColor}`,
              textAlign: "center",
            }}
          >
            {onlineDays?.text}
          </p>
        )}
      </div>

      <div className="card-body">
        <h6 className="card-title">{title}</h6>
        <sub>vin: {vin}</sub>
      </div>
      <div className="d-flex gap-2 justify-content-between p-3">
        <div>
          <PiGasPumpFill /> Gasoline
        </div>
        <div className="d-flex gap-2 align-items-center">
          <IoColorPaletteOutline />
          <div
            className="rounded"
            style={{
              backgroundColor: `${color}`,
              width: "2.9rem",
              height: "1.5rem",
              padding: "0.4rem",
              fontSize: "0.5rem",
              textTransform: "uppercase",
              fontWeight: "bold",
              color: "#fff",
              textAlign: "center",
            }}
          >
            {color}
          </div>
        </div>
      </div>

      <div className="d-flex gap-2 p-3">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={onDetails}
        >
          Details
        </button>
        <button
          type="button"
          onClick={onEdit!}
          className="btn btn-outline-secondary btn-sm"
        >
          Edit
        </button>
      </div>
    </div>
  );
}
