import { validateRequest } from "@/lib";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user } = await validateRequest();

  if (user) return redirect("/");

  return <>{children}</>;
}
