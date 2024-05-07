import { Nav } from "@/components";
import { validateRequest } from "@/lib";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Stories | Home",
};

export default async function StoriesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <Nav username={user.username} />
      {children}
    </div>
  );
}
