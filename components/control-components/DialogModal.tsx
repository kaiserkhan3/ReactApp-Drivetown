"use client";
import classes from "./DialogModal.module.css";

type DialogModalPorps = {
  children: React.ReactNode;
  zIndex?: number;
  top?: string;
  minWidth?: string;
  width?: string;
  height?: string;
};

// Render modal inline (no portal) to ensure the modal content stays within
// the same React tree and Suspense boundaries as its parent. Rendering via
// a portal into a top-level DOM node (like #modal) can cause React's async
// instrumentation to see resources created inside a Suspense boundary get
// cleaned up outside of it which triggers the runtime warning.
export default function DialogModal({
  children,
  zIndex = 1000000,
  top = "3rem",
  minWidth,
  width,
  height,
}: DialogModalPorps) {
  return (
    <>
      <div className={classes.backdrop}></div>
      <dialog
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
    </>
  );
}
