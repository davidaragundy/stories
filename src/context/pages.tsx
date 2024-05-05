import { User } from "lucia";
import { Context, createContext } from "react";
import { GlobalPageContext, PageStore } from "@/context";

export type PagesState = {
  user: User;
  context: Context<PageStore> | null;
};
export type PagesActions = {};

export type PagesStore = PagesState & PagesActions;

export const PagesContext = createContext<PagesStore>({
  context: GlobalPageContext,
} as PagesStore);
