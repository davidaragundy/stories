"use client";

import { ProfilePageContext } from "@/context";
import { type ReactNode, useContext } from "react";

export interface ProfilePageProviderProps {
  children: ReactNode;
}

export const ProfilePageProvider = ({ children }: ProfilePageProviderProps) => {
  const initialState = useContext(ProfilePageContext);

  return (
    <ProfilePageContext.Provider value={initialState}>
      {children}
    </ProfilePageContext.Provider>
  );
};
