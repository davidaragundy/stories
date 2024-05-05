import { getPostsAction } from "@/actions/get-posts";
import { Posts, CreatePost, Info } from "@/components";
import { validateRequest } from "@/lib";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["posts"],
    queryFn: async () => await getPostsAction(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full flex-1 gap-4 overflow-hidden pr-7 pt-7">
        <main className="flex h-full flex-1 flex-col items-center gap-14 overflow-y-auto overflow-x-hidden">
          <CreatePost />

          <Posts />
        </main>
        <Info
          title="Global 🌎?"
          description="Yep, here you can spread your 💩 to the whole world and see the posts of people who have posted to the whole world 🥳. Remember everything will be deleted in 24 hours. 🫣"
        />
      </div>
    </HydrationBoundary>
  );
}
