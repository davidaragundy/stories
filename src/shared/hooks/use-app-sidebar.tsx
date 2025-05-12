import { useMemo } from "react";
import {
  HomeIcon,
  UserRoundCheckIcon,
  VenetianMaskIcon,
  SearchIcon,
  BellIcon,
  MessageCircleIcon,
  UserRoundIcon,
  SettingsIcon,
} from "lucide-react";

import { useSession } from "@/shared/hooks/use-session";

export const useAppSidebar = () => {
  const {
    data: session,
    isSuccess: isSessionSuccess,
    isLoading: isSessionLoading,
    isError: isSessionError,
    refetch: refetchSession,
    isRefetching: isSessionRefetching,
  } = useSession();

  const links = useMemo(
    () => [
      { href: "/home", label: "Home", icon: <HomeIcon /> },
      {
        href: "/close-friends",
        label: "Close Friends",
        icon: <UserRoundCheckIcon />,
      },
      {
        href: "/ghosts",
        label: "Ghosts",
        icon: <VenetianMaskIcon />,
      },
      {
        href: "/explore",
        label: "Explore",
        icon: <SearchIcon />,
      },
      {
        href: "/notifications",
        label: "Notifications",
        icon: <BellIcon />,
      },
      { href: "/chat", label: "Chat", icon: <MessageCircleIcon /> },
      {
        href: `/${session?.user.username}`,
        label: "Profile",
        icon: <UserRoundIcon />,
      },
      {
        href: "/settings",
        label: "Settings",
        icon: <SettingsIcon />,
      },
    ],
    [session?.user.username]
  );

  return {
    links,
    session,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  };
};
