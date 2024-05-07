import { User } from "lucia";
import { createContext } from "react";

export type PageState = {
  user: User | null;
  posts?: {
    queryKey: string[];
    onlyFollowers?: boolean;
  };
  info?: {
    queryKey: string[];
  };
  profile?: {
    username: string;
  };
};

export type PageActions = {};

export type PageStore = PageState & PageActions;

const defaultInitState: PageStore = {
  user: null,
  posts: {
    queryKey: ["global", "posts"],
    onlyFollowers: false,
  },
};

export const PageContext = createContext<PageStore>(defaultInitState);
