"use client";

import { FollowingPageContext } from "@/context";
import { type ReactNode, useContext } from "react";

export interface FollowingPageProviderProps {
  children: ReactNode;
}

export const FollowingPageProvider = ({
  children,
}: FollowingPageProviderProps) => {
  const initialState = useContext(FollowingPageContext);

  return (
    <FollowingPageContext.Provider value={initialState}>
      {children}
    </FollowingPageContext.Provider>
  );
};
