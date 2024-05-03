import { getFollowingPostsAction } from "@/actions/get-following-posts";
import { CreatePost, Posts } from "@/components";
import { validateRequest } from "@/lib";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

const queryKey = "following";

export default async function Following() {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [queryKey],
    queryFn: async () => await getFollowingPostsAction(user.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex h-full flex-1 flex-col overflow-hidden p-7 pl-0">
        <div className="flex h-full w-full flex-col items-center gap-14 overflow-y-auto overflow-x-hidden">
          <CreatePost user={user} queryKey={queryKey} />

          <Posts user={user} following queryKey={queryKey} />
        </div>
      </main>
    </HydrationBoundary>
  );
}
