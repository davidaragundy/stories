import { createStore } from "zustand/vanilla";

export type PostState = {
  isPending: boolean;
};

export type PostActions = {
  setIsPending: (isPending: boolean) => void;
};

export type PostStore = PostState & PostActions;

export const defaultInitState: PostState = {
  isPending: false,
};

export const createPostStore = (initState: PostState = defaultInitState) => {
  return createStore<PostStore>()((set) => ({
    ...initState,
    setIsPending: (isPending) => set((_state) => ({ isPending })),
  }));
};
