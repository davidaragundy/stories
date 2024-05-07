import { getFollowingPostsAction } from "@/actions/get-following-posts";
import { CreatePost, Posts, Info } from "@/components";
import { validateRequest } from "@/lib";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

const postsQueryKey = ["following", "posts"];

export default async function Following() {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: postsQueryKey,
    queryFn: async () => await getFollowingPostsAction(user.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full flex-1 gap-4 overflow-hidden pr-7 pt-7">
        <main className="flex h-full flex-1 flex-col items-center gap-14 overflow-y-auto overflow-x-hidden">
          <CreatePost />

          <Posts />
        </main>
        <Info
          title="Following 🚶‍♀️..🏃?"
          description="Here you can spread your 💩 only to your followers and see the posts of people you follow who have posted only to their followers. 🤮 Remember, everything will be deleted in 24 hours. 🫣"
        />
      </div>
    </HydrationBoundary>
  );
}
