import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Sign up",
  description: "Sign up to Stories",
};

export default function SignUpLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
