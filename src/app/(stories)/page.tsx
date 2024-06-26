import { getGlobalPostsAction } from "@/actions/get-global-posts";
import { Posts, CreatePost, Info } from "@/components";
import { validateRequest } from "@/lib";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

const postsQueryKey = ["global", "posts"];

export default async function Home() {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: postsQueryKey,
    queryFn: async () => await getGlobalPostsAction(),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-full flex-1 gap-4 overflow-hidden">
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
