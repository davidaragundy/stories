import { Nav } from "@/components";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stories | Home",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full flex-1 overflow-hidden">
      <Nav />
      {children}
    </div>
  );
}
