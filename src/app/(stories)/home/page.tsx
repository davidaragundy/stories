import type { Metadata } from "next";

import { TypographyH1 } from "@/shared/components/ui/typography";

import { CreatePostForm } from "@/features/posts/components/create-post-form";
import { Posts } from "@/features/posts/components/posts";

export const metadata: Metadata = {
  title: "Stories | Home",
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6">
      <TypographyH1>Home</TypographyH1>

      <CreatePostForm />

      <Posts />
    </main>
  );
}
