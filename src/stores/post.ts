import { createStore } from "zustand/vanilla";

export type PostState = {
  id: string;
  isPending: boolean;
};

export type PostActions = {
  setId: (id: string) => void;
  setIsPending: (isPending: boolean) => void;
};

export type PostStore = PostState & PostActions;

const defaultInitState: PostState = {
  id: "",
  isPending: false,
};

export const createPostStore = (initState: PostState = defaultInitState) => {
  return createStore<PostStore>()((set) => ({
    ...initState,
    setId: (id) => set((_state) => ({ id })),
    setIsPending: (isPending) => set((_state) => ({ isPending })),
  }));
};
