import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { useIsMobile } from "@/shared/hooks/use-mobile";

export const useSettingsInMobile = () => {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  const isSettingsPage = pathname === "/settings";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return {
    isMounted,
    isMobile,
    isSettingsPage,
  };
};
