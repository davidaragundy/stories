"use client";

import { FC, PropsWithChildren } from "react";

import { useSettingsInMobile } from "@/features/settings/hooks/use-settings-in-mobile";

export const MobileWrapper: FC<PropsWithChildren> = ({ children }) => {
  const { isMobile, isMounted, isSettingsPage } = useSettingsInMobile();

  if (!isMounted) return null;

  if (isMobile && !isSettingsPage) return null;

  return children;
};
