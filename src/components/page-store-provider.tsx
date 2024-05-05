"use client";

import { type ReactNode, createContext, useRef } from "react";
import { type StoreApi } from "zustand";

import { type PageStore, createPageStore, PageState } from "@/stores";

export const PageStoreContext = createContext<StoreApi<PageStore> | null>(null);

export interface PageStoreProviderProps {
  children: ReactNode;
  initState?: PageState;
}

export const PageStoreProvider = ({
  children,
  initState,
}: PageStoreProviderProps) => {
  const storeRef = useRef<StoreApi<PageStore>>();

  if (!storeRef.current) {
    storeRef.current = createPageStore(initState);
  }

  return (
    <PageStoreContext.Provider value={storeRef.current}>
      {children}
    </PageStoreContext.Provider>
  );
};
