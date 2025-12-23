"use client";
import { SessionProvider } from "next-auth/react";
type ProviderProps = {
  children: React.ReactNode;
};
const Provider = ({ children }: ProviderProps) => {
  // return <SessionProvider>{children}</SessionProvider>;
  return <>{children}</>;
};

export default Provider;
