"use client";

import { cn } from "@/utils";
import { Button } from "@nextui-org/button";
import { Link } from "@nextui-org/link";
import { usePathname } from "next/navigation";

export const NavButton = ({
  link,
}: {
  link: { label: string; path: string; icon: React.ReactNode };
}) => {
  const pathname = usePathname();

  return (
    <Button
      as={Link}
      href={link.path}
      variant={pathname === link.path ? "flat" : "light"}
      color={pathname === link.path ? "primary" : "default"}
      className={cn("text-md", pathname === link.path && "font-bold")}
      startContent={link.icon}
    >
      {link.label}
    </Button>
  );
};
