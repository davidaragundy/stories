import type { Metadata } from "next";

import { H1, P } from "@/shared/components";

export const metadata: Metadata = {
  title: "Stories | Home",
};

export default function HomePage() {
  return (
    <main className="flex flex-col gap-6">
      <H1>Home</H1>
      <P>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
        corrupti numquam beatae optio eum necessitatibus iusto hic tempore
        dolores obcaecati magni fugit nisi nostrum est pariatur. Repudiandae
        suscipit sunt nesciunt?
      </P>
    </main>
  );
}
