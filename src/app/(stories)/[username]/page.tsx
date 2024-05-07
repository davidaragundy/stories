import { validateRequest } from "@/lib";
import { redirect } from "next/navigation";
import { FollowButton, Posts, ProfileInfo } from "@/components";
import {
  HydrationBoundary,
  QueryClient,
  dehydrate,
} from "@tanstack/react-query";
import { getProfilePostsAction } from "@/actions/get-profile-posts";
import { Avatar } from "@nextui-org/avatar";
import { getProfileDataAction } from "@/actions/get-profile-data";

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const { user } = await validateRequest();

  if (!user) return redirect("/sign-in");

  const queryClient = new QueryClient();

  const postQueryKey = ["profile", params.username, "posts"];

  await queryClient.prefetchQuery({
    queryKey: postQueryKey,
    queryFn: async () =>
      await getProfilePostsAction(
        params.username,
        user.username !== params.username,
      ),
  });

  const profileData = await getProfileDataAction(params.username);

  await queryClient.prefetchQuery({
    queryKey: ["profile", params.username, "info"],
    queryFn: async () => profileData,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <main className="flex h-full flex-1 flex-col items-center gap-14 overflow-y-auto overflow-x-hidden pr-7 pt-7">
        <div className="flex flex-col items-center gap-2 text-center">
          <Avatar
            src={profileData.avatarUrl}
            alt={`${profileData.firstName}'s profile photo`}
            isBordered
            className="h-40 w-40"
          />

          <div>
            <h3 className="text-3xl font-bold">
              {profileData.firstName} {profileData.lastName}
            </h3>

            <p className="text-default-400">@{profileData.username}</p>
          </div>

          {user.username !== params.username && <FollowButton />}

          <ProfileInfo />
        </div>

        <Posts />
      </main>
    </HydrationBoundary>
  );
}
