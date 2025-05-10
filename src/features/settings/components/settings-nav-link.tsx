"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRightIcon } from "lucide-react";

import { cn } from "@/shared/utils/cn";

type Props = {
  href: string;
  label: string;
  icon: React.ReactNode;
  includeArrow?: boolean;
  exactMatch?: boolean;
  additionalMatches?: string[];
} & React.ComponentProps<typeof Link>;

export const SettingsNavLink = ({
  href,
  label,
  icon,
  includeArrow,
  exactMatch,
  additionalMatches,
  ...props
}: Props) => {
  const pathname = usePathname();

  const matches = [href, ...(additionalMatches || [])];
  const isActive = matches.some((match) =>
    exactMatch ? pathname === match : pathname.startsWith(match)
  );

  return (
    <Link
      title={label}
      aria-label={label}
      href={href}
      className={cn(
        "w-fit flex flex-wrap items-center text-xl gap-2 rounded-xl px-4 py-2 transition-all duration-200",
        isActive ? "bg-accent" : "hover:bg-accent",
        includeArrow && "w-full justify-between"
      )}
      {...props}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      {includeArrow && <ArrowRightIcon />}
    </Link>
  );
};
