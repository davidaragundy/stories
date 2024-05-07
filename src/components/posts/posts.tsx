"use client";

import { getGlobalPostsAction } from "@/actions/get-global-posts";
import { getFollowingPostsAction } from "@/actions/get-following-posts";
import { getProfilePostsAction } from "@/actions/get-profile-posts";
import { useQuery } from "@tanstack/react-query";
import { Post, PostsSkeleton, PostsError, PostProvider } from "@/components";
import { usePageState } from "@/hooks";

export const Posts = () => {
  const { posts, user, profile } = usePageState();

  const { data, isLoading, isError } = useQuery({
    queryKey: posts!.queryKey,
    queryFn: async () => {
      if (posts?.queryKey.includes("global"))
        return await getGlobalPostsAction();

      if (posts?.queryKey.includes("following"))
        return await getFollowingPostsAction(user!.id);

      if (posts?.queryKey.includes("profile"))
        return await getProfilePostsAction(
          profile?.username || user!.username,
          profile?.username !== user!.username,
        );
    },
  });

  if (isLoading) return <PostsSkeleton />;

  if (isError) {
    return <PostsError />;
  }

  return (
    data &&
    data.map((post) => (
      <PostProvider key={post.id}>
        <Post post={post} />
      </PostProvider>
    ))
  );
};
