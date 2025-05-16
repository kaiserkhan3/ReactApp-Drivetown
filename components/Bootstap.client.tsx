"use client";

import { useEffect } from "react";

export default function BootstapClient() {
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require("@floating-ui/react");
    require("@floating-ui/react-dom");
    require("./providers/globals.js");
  }, []);

  return null;
}
