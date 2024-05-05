import { ProfilePageProvider } from "@/components";
import { validateRequest } from "@/lib";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { redirect } from "next/navigation";

export default async function Profile() {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  const queryKey = ["profile", user.id];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey,
    // queryFn: async () => await getPostsFrom(user.id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProfilePageProvider>
        <div className="flex h-full flex-1 gap-4 overflow-hidden pr-7 pt-7">
          <main className="flex h-full flex-1 flex-col items-center gap-14 overflow-y-auto overflow-x-hidden">
            {/* <Posts user={user} queryKey={queryKey} /> */}
          </main>
        </div>
      </ProfilePageProvider>
    </HydrationBoundary>
  );
}
