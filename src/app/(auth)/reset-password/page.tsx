import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Suspense, use } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { ResetPasswordForm } from "@/features/auth/components";

export const metadata: Metadata = {
  title: "Stories | Reset Password",
  description: "Reset your password",
};

//TODO: Implement ResetPasswordFormFallback
function ResetPasswordFormFallback() {
  return <></>;
}

export default function ForgotPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { token } = use(searchParams);

  if (!token) return redirect("/forgot-password");

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
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
        <Suspense fallback={<ResetPasswordFormFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </div>
  );
}
