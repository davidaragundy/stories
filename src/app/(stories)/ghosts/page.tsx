import type { Metadata } from "next";

import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";

export const metadata: Metadata = {
  title: "Stories | Ghosts",
};

export default function GhostsPage() {
  return (
    <main className="flex flex-col gap-6">
      <TypographyH1>Ghosts</TypographyH1>
      <TypographyP className="transition-all duration-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
        corrupti numquam beatae optio eum necessitatibus iusto hic tempore
        dolores obcaecati magni fugit nisi nostrum est pariatur. Repudiandae
        suscipit sunt nesciunt?
      </TypographyP>
    </main>
  );
}
