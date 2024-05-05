import { QueryKey } from "@tanstack/react-query";

export * from "./following-page";
export * from "./global-page";
export * from "./pages";
export * from "./profile-page";

export type PageState = {
  queryKey: QueryKey;
  onlyFollowers?: boolean;
};

export type PageActions = {};

export type PageStore = PageState & PageActions;
