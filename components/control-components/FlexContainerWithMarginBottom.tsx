import React, { ReactNode } from "react";
import classes from "./FlexContainerWithMarginBotton.module.css";

type FlextContainerMB3Props = {
  children: ReactNode;
  mb?: number;
};
export default function FlextContainerMB({
  children,
  mb = 3,
}: FlextContainerMB3Props) {
  return (
    <div
      className={`pt-2 ps-2 bd-highlight m-1 mb-${mb} ${classes.flexContainer}`}
    >
      {children}
    </div>
  );
}
