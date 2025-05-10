import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  return {
    title: `Stories | Profile (@${username})`,
  };
}

export default async function NotificationsPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  return (
    <main className="flex flex-col gap-6">
      <TypographyH1>{username}</TypographyH1>
      <TypographyP className="transition-all duration-300">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque,
        corrupti numquam beatae optio eum necessitatibus iusto hic tempore
        dolores obcaecati magni fugit nisi nostrum est pariatur. Repudiandae
        suscipit sunt nesciunt?
      </TypographyP>
    </main>
  );
}
