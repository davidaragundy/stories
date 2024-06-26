import { Nav } from "@/components";
import { validateRequest } from "@/lib";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Stories | Global",
};

export default async function StoriesLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  return (
    <div className="flex w-full flex-1 gap-4 overflow-hidden p-6">
      <Nav username={user.username} />
      {children}
    </div>
  );
}
