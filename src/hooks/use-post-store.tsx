import { PostStoreContext } from "@/components";
import { PostStore } from "@/stores";
import { useContext } from "react";
import { useStore } from "zustand";

export const useCounterStore = <T,>(selector: (store: PostStore) => T): T => {
  const postStoreContext = useContext(PostStoreContext);

  if (!postStoreContext) {
    throw new Error(`useCounterStore must be use within PostStoreProvider`);
  }

  return useStore(postStoreContext, selector);
};
