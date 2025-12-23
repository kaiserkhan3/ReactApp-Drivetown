"use client";
import { InventoryImageDto } from "@/models/inventory/models";
import { buildImagePath } from "@/utilities";

export const ImageSlider = ({ images }: { images: InventoryImageDto[] }) => {
  return (
    <div className="d-flex justify-center">
      <div
        id="carouselExampleInterval"
        className="carousel slide w-[80%] mx-auto"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner w-full">
          {images?.map((item, index) => (
            <div
              className={`carousel-item ${index === 0 ? "active" : ""}`}
              data-bs-interval="2000"
              key={item.inventoryImageId}
            >
              <img
                src={buildImagePath("vehicle", item.imageName)}
                className="d-block w-full"
                style={{ height: "500px" }}
                alt={item.imageName}
              />
            </div>
          ))}
        </div>
        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#carouselExampleInterval"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span className="visually-hidden">Next</span>
        </button>
      </div>
    </div>
  );
};
