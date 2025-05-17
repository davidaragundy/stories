"use client";

import { useLiveQuery } from "@tanstack/react-db";

import { postCollection } from "@/features/posts/collections/post-collection";
import type { Post } from "@/features/posts/types";

export const Posts = () => {
  const { data } = useLiveQuery((query) =>
    query.from({ postCollection }).keyBy("@id").select("@*")
  );

  const posts = data as Post[];

  return (
    <div>{posts?.map((post) => <div key={post.id}>{post.content}</div>)}</div>
  );
};
