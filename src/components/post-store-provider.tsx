"use client";

import { type ReactNode, createContext, useRef } from "react";
import { type StoreApi } from "zustand";

import { type PostStore, createPostStore } from "@/stores";

export const PostStoreContext = createContext<StoreApi<PostStore> | null>(null);

export interface PostStoreProviderProps {
  children: ReactNode;
}

export const PostStoreProvider = ({ children }: PostStoreProviderProps) => {
  const storeRef = useRef<StoreApi<PostStore>>();

  if (!storeRef.current) {
    storeRef.current = createPostStore();
  }

  return (
    <PostStoreContext.Provider value={storeRef.current}>
      {children}
    </PostStoreContext.Provider>
  );
};
