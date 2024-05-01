"use client";

import { QueryProvider, UIProviders } from "@/components";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <UIProviders>
        <Toaster />
        {children}
      </UIProviders>
    </QueryProvider>
  );
};
