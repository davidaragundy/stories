import type { Metadata } from "next";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { RecoveryForm } from "@/features/auth/components/recovery-form";

export const metadata: Metadata = {
  title: "Stories | Recovery",
  description: "Use recovery code to access your account.",
};

export default function RecoveryPage() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link
        href="/"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
          <GalleryVerticalEnd className="size-4" />
        </div>
        Stories
      </Link>
      <RecoveryForm />
    </div>
  );
}
