import { createContext } from "react";
import { PageStore } from "@/context";

export const GlobalPageContext = createContext<PageStore>({
  queryKey: ["posts"],
  onlyFollowers: false,
});
