"use client";

import { getPostsAction } from "@/actions/get-posts";
import { getFollowingPostsAction } from "@/actions/get-following-posts";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucia";
import { Post, PostSkeleton, PostError } from "@/components";

export const Posts = ({
  user,
  following,
  queryKey,
}: {
  user: User;
  following?: boolean;
  queryKey: string;
}) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: [queryKey],
    queryFn: async () =>
      following
        ? await getFollowingPostsAction(user.id)
        : await getPostsAction(),
  });

  if (isLoading) return <PostSkeleton />;

  if (isError) {
    return <PostError refetch={refetch} />;
  }

  return (
    data &&
    data.map((post) => (
      <Post key={post.id} post={post} user={user} queryKey={queryKey} />
    ))
  );
};
