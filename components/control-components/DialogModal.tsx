"use client";
import { createPortal } from "react-dom";
import classes from "./DialogModal.module.css";

type DialogModalPorps = {
  children: React.ReactNode;
  zIndex?: number;
  top?: string;
  minWidth?: string;
  width?: string;
  height?: string;
};

export default function DialogModal({
  children,
  zIndex = 1000000,
  top = "3rem",
  minWidth,
  width,
  height,
}: DialogModalPorps) {
  return createPortal(
    <>
      <div className={classes.backdrop}></div>
      <dialog
        id="modal"
        className={classes.modal}
        style={{
          zIndex: `${zIndex}`,
          top: `${top}`,
          scrollBehavior: "smooth",
          overflow: "auto",
          minWidth: `${minWidth}`,
          width: `${width}`,
          height: `${height}`,
        }}
        open
      >
        {children}
      </dialog>
    </>,
    document.getElementById("modal")!
  );
}
