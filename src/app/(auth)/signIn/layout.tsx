import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Sign in",
  description: "Sign in to Stories",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
