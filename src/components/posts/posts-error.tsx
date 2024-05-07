"use client";

import { usePageState } from "@/hooks";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";

export const PostsError = () => {
  const { posts } = usePageState();

  const { refetch, isRefetching } = useQuery({
    queryKey: posts!.queryKey,
  });

  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <p>Something went wrong 😭</p>
      <Button
        isLoading={isRefetching}
        color="danger"
        size="sm"
        radius="lg"
        onClick={() => refetch()}
      >
        Retry
      </Button>
    </div>
  );
};
