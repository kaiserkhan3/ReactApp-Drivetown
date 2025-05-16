"use client";
import { createPortal } from "react-dom";
import classes from "./DialogModal.module.css";

type DialogModalPorps = {
  children: React.ReactNode;
  zIndex?: number;
};

export default function DialogModal({
  children,
  zIndex = 1000000,
}: DialogModalPorps) {
  return createPortal(
    <>
      <div className={classes.backdrop}></div>
      <dialog
        id="modal"
        className={classes.modal}
        style={{ zIndex: `${zIndex}` }}
        open
      >
        {children}
      </dialog>
    </>,
    document.getElementById("modal")!
  );
}
