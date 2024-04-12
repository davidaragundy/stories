import { Nav } from "@/components";
import { validateRequest } from "@/lib";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Stories | Home",
};

export default async function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <Nav />
      {children}
    </div>
  );
}
