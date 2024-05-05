import { createContext } from "react";
import { PageStore } from "@/context";

export const FollowingPageContext = createContext<PageStore>({
  queryKey: ["following"],
  onlyFollowers: true,
});
