"use client"; // Error boundaries must be Client Components

import { Button } from "@/shared/components/ui/button";
import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";
import { RotateCcwIcon } from "lucide-react";
import { useEffect } from "react";

interface Props {
  error: Error;
  reset: () => void;
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    document.title = "Stories | Error";
  }, []);

  return (
    <div className="h-full flex flex-col gap-4 items-center justify-center">
      <TypographyH1>Something went wrong!</TypographyH1>
      <TypographyMuted>{error.message}</TypographyMuted>

      <Button onClick={reset} className="flex items-center gap-2">
        <RotateCcwIcon /> Reload page
      </Button>
    </div>
  );
}
