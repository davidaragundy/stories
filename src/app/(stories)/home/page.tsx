import type { Metadata } from "next";
import { H1 } from "@/shared/components";

export const metadata: Metadata = {
  title: "Stories | Home",
};

export default function HomePage() {
  return <H1>Home</H1>;
}
