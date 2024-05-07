"use client";

import { PageContext } from "@/context";
import { useContext } from "react";

export const usePageState = () => {
  const pageState = useContext(PageContext);

  return pageState;
};
