"use client";
import * as React from "react";
import { createTheme } from "@mui/material/styles";
import { NAVIGATION } from "../../constants/Navigation";
import drivetownlogo from "@/public/logo_DriveTown.png";
import { AppProvider } from "@toolpad/core/AppProvider";
import { DashboardLayout } from "@toolpad/core/DashboardLayout";
import Image from "next/image";
import { makeStyles } from "@mui/styles";
import { useDemoRouter } from "@toolpad/core/internal";

const useStyles = makeStyles(() => ({
  root: {
    "& .MuiDrawer-root": {
      maxHeight: "100vh",
      backgroundImage: "none",
      overflow: "scroll",
      scrollBehavior: "auto",
    },
    "& .MuiDrawer-docked": {
      width: "280px",
    },
    "& .MuiTableCell-body": {
      fontSixe: "0.6rem",
    },
  },
}));

const demoTheme = createTheme({
  colorSchemes: { light: true, dark: true },
  cssVariables: {
    colorSchemeSelector: "class",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

type DashboardProps = {
  children: React.ReactNode;
};

export default function DashboardLayoutBasic({ children }: DashboardProps) {
  const classes = useStyles();
  const router = useDemoRouter();

  return (
    <AppProvider
      navigation={NAVIGATION}
      theme={demoTheme}
      branding={{
        logo: (
          <Image
            src={drivetownlogo}
            alt="Drivetown"
            style={{ width: "180px" }}
          />
        ),
        title: "",
      }}
      router={router}
    >
      <DashboardLayout>{children}</DashboardLayout>
    </AppProvider>
  );
}
