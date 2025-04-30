"use client";

import { Button } from "@/shared/components/ui/button";
import { cn } from "@/shared/utils/cn";
import { ClipboardIcon } from "lucide-react";

export const Code: React.FC<React.ComponentProps<"code">> = ({
  className,
  children,
  ...props
}) => {
  const handleClick = () => {
    navigator.clipboard.writeText(children as string);
  };

  return (
    <span className="flex items-center gap-4">
      <code
        className={cn(
          "relative break-all rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-semibold",
          className
        )}
        {...props}
      >
        {children}
      </code>

      <Button
        onClick={handleClick}
        className="cursor-pointer"
        variant="ghost"
        size="icon"
      >
        <ClipboardIcon />
      </Button>
    </span>
  );
};
