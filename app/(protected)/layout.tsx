import "bootstrap/dist/css/bootstrap.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import BootstapClient from "../../components/Bootstap.client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { TanstackProvider } from "@/components/providers/Tanstackprovider";
import { CssBaseline } from "@mui/material";
import { StoreProvider } from "@/components/providers/StoreProvider";
import Provider from "@/components/providers/Provider";

import { MasterLayout } from "@/components/master-page/master-layout";

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
          <Provider>
            <TanstackProvider>
              <MasterLayout>{children}</MasterLayout>
            </TanstackProvider>
          </Provider>
        </StoreProvider>
        <CssBaseline />
        <BootstapClient />
      </AppRouterCacheProvider>
    </>
  );
}
