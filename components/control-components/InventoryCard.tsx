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
    ? `${process.env.NEXT_PUBLIC_SHARED_FOLDER_URL!}/vehicle/${imageName}`
    : defaultImage.src;

  return (
    <div
      className="card"
      style={{ width: "10rem", height: "12rem", fontSize: "14px" }} // reduced overall size
      onClick={onDetails}
    >
      <div
        className="d-flex flex-grow-1 justify-content-between text-center p-1"
        style={{
          height: "7rem", // background image fits here
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover", // ensures image fills the area
          backgroundPosition: "center", // centers the image
          backgroundRepeat: "no-repeat",
          color: "#fff",
          fontSize: "0.7rem",
        }}
      >
        <span
          className={`p-1 mt-1 rounded ${status === "Sold" ? "bg-success" : "bg-warning"}`}
          style={{ height: "1.5rem", textAlign: "center", fontSize: "0.6rem" }}
        >
          {status}
        </span>
        {onlineDays?.text && (
          <p
            className="p-1 mt-1 rounded"
            style={{
              color: "#fff",
              height: "1.5rem",
              backgroundColor: `${onlineDays.bgColor}`,
              textAlign: "center",
              fontSize: "0.6rem",
            }}
          >
            {onlineDays.text}
          </p>
        )}
      </div>

      <div className="card-body p-2">
        <h6 className="card-title" style={{ fontSize: "0.7rem" }}>
          {title}
        </h6>
        <sub style={{ fontSize: "0.6rem" }}>vin: {vin}</sub>
      </div>

      <div className="d-flex gap-1 justify-content-between px-2 pb-2">
        <div style={{ fontSize: "0.6rem" }}>
          <PiGasPumpFill /> Gasoline
        </div>
        <div className="d-flex gap-1 align-items-center">
          <IoColorPaletteOutline />
          <div
            className="rounded"
            style={{
              backgroundColor: `${color}`,
              width: "2.5rem",
              height: "1.2rem",
              padding: "0.2rem",
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
    </div>
  );
}
