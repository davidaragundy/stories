import { CreatePost, Post } from "@/components";
import { validateRequest, postCollection } from "@/lib";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();
  const postDocs = await postCollection.list();

  if (!user) return redirect("/signIn");

  return (
    <main className="flex h-full flex-1 flex-col overflow-hidden p-7 pl-0">
      <div className="flex h-full w-full flex-col items-center gap-5 overflow-y-auto overflow-x-hidden">
        <CreatePost />
        {postDocs.map(({ id, data }) => (
          <Post key={id} post={{ id, ...data }} user={user} />
        ))}
      </div>
    </main>
  );
}
