"use client";

import { QueryProvider, UIProviders } from ".";
import {
  FollowingPageContext,
  GlobalPageContext,
  PagesContext,
  ProfilePageContext,
} from "@/context";
import { User } from "lucia";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactNode;
  user: User;
}

export const Providers = ({ children, user }: Props) => {
  const pathName = usePathname();

  const state =
    pathName === "/"
      ? { context: GlobalPageContext, onlyFollowers: false }
      : pathName === "/following"
        ? { context: FollowingPageContext, onlyFollowers: true }
        : { context: ProfilePageContext };

  return (
    <QueryProvider>
      <UIProviders>
        <PagesContext.Provider value={{ user, ...state }}>
          <Toaster />
          {children}
        </PagesContext.Provider>
      </UIProviders>
    </QueryProvider>
  );
};
