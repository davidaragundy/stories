import type { Metadata } from "next";

import { ThemeSwitch } from "@/shared/components/theme-switch";

export const metadata: Metadata = {
  title: "Stories",
  description: "Fuck it, we ball",
};

export default function Home() {
  return (
    <main>
      <ThemeSwitch />
    </main>
  );
}
