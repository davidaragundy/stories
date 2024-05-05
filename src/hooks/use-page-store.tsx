"use client";

import { PageStoreContext } from "@/components";
import { PageStore } from "@/stores";
import { useContext } from "react";
import { useStore } from "zustand";

export const usePageStore = <T,>(selector: (store: PageStore) => T): T => {
  const pageStoreContext = useContext(PageStoreContext);

  if (!pageStoreContext) {
    throw new Error(`usePostStore must be use within PostStoreProvider`);
  }

  return useStore(pageStoreContext, selector);
};
