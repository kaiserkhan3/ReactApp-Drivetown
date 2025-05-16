import "bootstrap/dist/css/bootstrap.css";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import BootstapClient from "../components/Bootstap.client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { CssBaseline } from "@mui/material";
import { TanstackProvider } from "@/components/providers/Tanstackprovider";
import { ToastContainer } from "react-toastify";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AppRouterCacheProvider options={{ key: "css" }}>
          <TanstackProvider>
            {children}
            <div id="modal"></div>
            <ToastContainer />
          </TanstackProvider>
          <BootstapClient />
          <CssBaseline />
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
