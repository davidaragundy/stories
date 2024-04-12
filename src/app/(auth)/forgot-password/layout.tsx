import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Forgot Password",
  description: "Reset your password for your Stories account.",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
