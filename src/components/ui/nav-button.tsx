"use client";

import { cn } from "@/utils";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  link: { label: string; path: string; icon: ReactNode };
}

export const NavButton = ({ link }: Props) => {
  const pathname = usePathname();

  return (
    <Button
      as={Link}
      href={link.path}
      variant={pathname === link.path ? "flat" : "light"}
      color={pathname === link.path ? "primary" : "default"}
      className={cn(
        "text-md rounded-2xl",
        pathname === link.path && "font-bold",
      )}
      startContent={link.icon}
    >
      {link.label}
    </Button>
  );
};
