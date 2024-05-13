"use client";

import { cn } from "@/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface Props {
  link: { label: string; path: string; icon: ReactNode };
}

export const NavButton = ({ link }: Props) => {
  const pathname = usePathname();

  return (
    <Link
      href={link.path}
      className={cn(
        "flex cursor-pointer items-center justify-center gap-2 rounded-2xl p-2",
        pathname === link.path
          ? "bg-primary-100 font-bold text-primary"
          : "hover:bg-default-200",
      )}
    >
      {link.icon}
      {link.label}
    </Link>
  );
};
