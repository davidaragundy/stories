"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      richColors
      position="top-center"
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:!transition-all group-[.toaster]:!duration-500 group-[.toaster]:!bg-background group-[.toaster]:!text-foreground group-[.toaster]:!border-border group-[.toaster]:!shadow-lg group-[.toaster]:!rounded-[var(--radius-lg)]",
          description: "group-[.toast]:!text-muted-foreground",
          actionButton:
            "group-[.toast]:!bg-primary group-[.toast]:!text-primary-foreground group-[.toast]:!rounded-[var(--radius-sm)] !font-medium",
          cancelButton:
            "group-[.toast]:!bg-muted group-[.toast]:!text-muted-foreground group-[.toast]:!rounded-[var(--radius-sm)] !font-medium",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
