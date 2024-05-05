"use client";

import { PagesContext } from "@/context";
import { useContext } from "react";

export const usePageState = () => {
  const { user, context } = useContext(PagesContext);

  if (!context) {
    throw new Error("usePageState must be used within PagesContext");
  }

  const pageState = useContext(context);

  return { user, ...pageState };
};
