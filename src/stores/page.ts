import { QueryKey } from "@tanstack/react-query";
import { User } from "lucia";
import { createStore } from "zustand/vanilla";

export type PageState = {
  user: User;
  queryKey: QueryKey;
  onlyFollowers?: boolean;
};

export type PageActions = {
  setUser: (user: User) => void;
  setQueryKey: (queryKey: QueryKey) => void;
  setOnlyFollowers: (onlyFollowers: boolean) => void;
};

export type PageStore = PageState & PageActions;

const defaultInitState: PageState = {
  user: {} as User,
  queryKey: [""],
  onlyFollowers: false,
};

export const createPageStore = (initState: PageState = defaultInitState) => {
  return createStore<PageStore>()((set) => ({
    ...initState,
    setUser: (user) => set((_state) => ({ user })),
    setQueryKey: (queryKey) => set((_state) => ({ queryKey })),
    setOnlyFollowers: (onlyFollowers) => set((_state) => ({ onlyFollowers })),
  }));
};
