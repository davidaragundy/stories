import { validateRequest } from "@/lib";
import { redirect } from "next/navigation";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  if (user) return redirect("/");

  return <>{children}</>;
}
