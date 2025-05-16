"use client";

import { FC } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store/store";

type StoreProviderProps = {
  children: React.ReactNode;
};

export const StoreProvider: FC<StoreProviderProps> = ({ children }) => {
  return <Provider store={store}>{children}</Provider>;
};
