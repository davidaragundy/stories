"use client";

import { GlobalPageContext } from "@/context";
import { type ReactNode, useContext } from "react";

export interface GlobalPageProviderProps {
  children: ReactNode;
}

export const GlobalPageProvider = ({ children }: GlobalPageProviderProps) => {
  const initialState = useContext(GlobalPageContext);

  return (
    <GlobalPageContext.Provider value={initialState}>
      {children}
    </GlobalPageContext.Provider>
  );
};
