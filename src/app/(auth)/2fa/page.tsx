import type { Metadata } from "next";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";
import { TwoFactorForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Stories | 2FA",
  description: "2FA for your account",
};

export default function TwoFactorPage() {
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
      <TwoFactorForm />
    </div>
  );
}
