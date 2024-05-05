import { createContext } from "react";
import { PageStore } from "@/context";

export const ProfilePageContext = createContext<PageStore>({
  queryKey: ["profile"],
});
