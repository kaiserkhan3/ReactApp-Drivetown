import "bootstrap/dist/css/bootstrap.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import BootstapClient from "../../components/Bootstap.client";
import DashboardLayoutBasic from "../../components/side-navigation/SideNav";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { TanstackProvider } from "@/components/providers/Tanstackprovider";
import { CssBaseline } from "@mui/material";
import { StoreProvider } from "@/components/providers/StoreProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drivetown",
  description: "Used car sale",
};

export default function AfterLoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <AppRouterCacheProvider options={{ key: "css" }}>
        <StoreProvider>
          <TanstackProvider>
            <DashboardLayoutBasic>{children}</DashboardLayoutBasic>
          </TanstackProvider>
        </StoreProvider>
        <CssBaseline />
        <BootstapClient />
      </AppRouterCacheProvider>
    </>
  );
}
