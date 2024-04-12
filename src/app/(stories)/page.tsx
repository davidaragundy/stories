import { CreatePost, Post } from "@/components";
import { EXPIRATION_TIME } from "@/constants";
import { db } from "@/drizzle";
import { validateRequest } from "@/lib";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  const posts = await db.query.posts.findMany({
    where: (fields, { gt }) =>
      gt(fields.createdAt, Date.now() - EXPIRATION_TIME),
    orderBy: (fields, { desc }) => [desc(fields.createdAt)],
    with: {
      user: {
        columns: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          avatarUrl: true,
        },
      },
      media: true,
      reactions: {
        columns: {
          userId: true,
          type: true,
        },
      },
    },
  });
  if (!user) return redirect("/sign-in");

  return (
    <main className="flex h-full flex-1 flex-col overflow-hidden p-7 pl-0">
      <div className="flex h-full w-full flex-col items-center gap-5 overflow-y-auto overflow-x-hidden">
        <CreatePost user={user} />
        {posts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </main>
  );
}
