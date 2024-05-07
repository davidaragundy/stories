"use client";

import { QueryProvider, UIProviders } from ".";
import { PageContext, PageState } from "@/context";
import { User } from "lucia";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

interface Props {
  children: ReactNode;
  user: User | null;
}

export const RootProviders = ({ children, user }: Props) => {
  const pathName = usePathname();

  const state: Omit<PageState, "user"> =
    pathName === "/"
      ? { posts: { queryKey: ["global", "posts"], onlyFollowers: false } }
      : pathName === "/following"
        ? { posts: { queryKey: ["following", "posts"], onlyFollowers: true } }
        : !pathName.startsWith("/rooms")
          ? {
              posts: {
                queryKey: ["profile", pathName.slice(1), "posts"],
              },
              info: { queryKey: ["profile", pathName.slice(1), "info"] },
              profile: { username: pathName.slice(1) },
            }
          : {};

  return (
    <QueryProvider>
      <UIProviders>
        <PageContext.Provider value={{ user, ...state }}>
          <Toaster />
          {children}
        </PageContext.Provider>
      </UIProviders>
    </QueryProvider>
  );
};
