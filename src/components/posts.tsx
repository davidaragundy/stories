"use client";

import { getPostsAction } from "@/actions/get-posts";
import { getOnlyFollowersPostsAction } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { Post, PostSkeleton, PostError, PostStoreProvider } from "@/components";
import { usePageState } from "@/hooks";

export const Posts = () => {
  const { queryKey, onlyFollowers, user } = usePageState();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey,
    queryFn: async () =>
      onlyFollowers
        ? await getOnlyFollowersPostsAction(user.id)
        : await getPostsAction(),
  });

  if (isLoading) return <PostSkeleton />;

  if (isError) {
    return <PostError refetch={refetch} />;
  }

  return (
    data &&
    data.map((post) => (
      <PostStoreProvider key={post.id}>
        <Post post={post} />
      </PostStoreProvider>
    ))
  );
};
