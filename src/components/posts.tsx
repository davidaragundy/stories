"use client";

import { getPostsAction } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { User } from "lucia";
import { Post, PostSkeleton, PostError } from "@/components";

export const Posts = ({ user }: { user: User }) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => await getPostsAction(),
  });

  if (isLoading) return <PostSkeleton />;

  if (isError) {
    return <PostError refetch={refetch} />;
  }

  return data ? (
    data.map((post) => <Post key={post.id} post={post} user={user} />)
  ) : (
    <PostError refetch={refetch} />
  );
};
