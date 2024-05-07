"use client";

import { usePostState } from "@/hooks";
import { Reaction } from "@/types";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";

interface Props {
  reaction: Reaction;
}

export const PostReactionModalError = ({ reaction }: Props) => {
  const { id } = usePostState();

  const { refetch, isRefetching } = useQuery({
    queryKey: ["post", id, "reactions", reaction],
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
