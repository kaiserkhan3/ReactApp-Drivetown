import * as React from "react";
import Vehicle from "@/public/car.jpg";
import Image from "next/image";

function InventoryHeader() {
  return (
    <div className="container-fluid mb-4 shadow-lg p-3 rounded">
      <div className="row row-cols-1 row-cols-lg-4">
        <div className="col">
          <div className="p-2 mb-2 bg-primary text-white rounded">
            <div className="row">
              <div className="col-md-4">
                <Image
                  key="available"
                  src={Vehicle}
                  alt="Total number of vehicles"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "30px",
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h6 className="card-title">Total number of vehicles</h6>
                  <p className="card-text">35</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="p-2 mb-2 bg-success text-white rounded">
            <div className="row">
              <div className="col-md-4">
                <Image
                  key="sold"
                  src={Vehicle}
                  alt="Total number of vehicles"
                  style={{
                    height: "60px",
                    width: "60px",
                    borderRadius: "30px",
                  }}
                />
              </div>
              <div className="col-md-8">
                <div className="card-body">
                  <h6 className="card-title">Sold Vehicles</h6>
                  <p className="card-text">1500</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col">
          <div className="p-2 mb-2 bg-warning text-dark">.bg-secondary</div>
        </div>
        <div className="col">
          <div className="p-2 mb-2 bg-danger text-white">.bg-secondary</div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(InventoryHeader);
