"use client";

import { usePageStore } from "@/hooks";
import { User } from "lucia";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface Props {
  children: React.ReactNode;
  user: User;
  profileId?: string;
}

export const PageStoreDispatcher = ({ children, user, profileId }: Props) => {
  const { setUser, setQueryKey, setOnlyFollowers } = usePageStore(
    (state) => state,
  );
  const pathName = usePathname();

  useEffect(() => {
    setUser(user);

    if (pathName === "/") {
      setQueryKey(["posts"]);
      setOnlyFollowers(false);

      return;
    }

    if (pathName === "/following") {
      setQueryKey(["following"]);
      setOnlyFollowers(true);

      return;
    }

    if (pathName === "/profile") {
      setQueryKey(["profile", user.id]);

      return;
    }

    if (profileId) {
      setQueryKey(["profile", profileId]);

      return;
    }
  }, [pathName, profileId, setOnlyFollowers, setQueryKey, setUser, user]);

  return <>{children}</>;
};
