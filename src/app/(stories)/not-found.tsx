import Link from "next/link";
import { HomeIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { TypographyH1 } from "@/shared/components/ui/typography";

export default function NotFound() {
  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <TypographyH1 className="text-center">Page not found</TypographyH1>

      <Button asChild className="flex items-center gap-2">
        <Link href="/home">
          <HomeIcon /> Go to home
        </Link>
      </Button>
    </div>
  );
}
