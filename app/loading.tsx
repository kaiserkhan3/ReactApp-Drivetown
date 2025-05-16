"use client";
import React from "react";

import loadingImg from "@/public/rotate.gif";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="loadingContainer">
      <Image
        src={loadingImg}
        priority
        alt="Fetching Data"
        unoptimized
        className="image"
      />
    </div>
  );
}
