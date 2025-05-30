import type { Metadata } from "next";
import Link from "next/link";
import { GalleryVerticalEnd } from "lucide-react";

import { SignUpForm } from "@/features/auth/components/sign-up-form";

export const metadata: Metadata = {
  title: "Stories | Sign Up",
  description: "Sign up to Stories",
};

export default function SignUpPage() {
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
      <SignUpForm />
    </div>
  );
}
