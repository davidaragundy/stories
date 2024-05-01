"use client";

import { FullPost } from "@/types";
import { Button } from "@nextui-org/button";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export const PostError = ({
  refetch,
}: {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<FullPost[], Error>>;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-default-50 p-4">
      <p>Something went wrong while fetching the posts. 😭</p>
      <Button
        color="danger"
        onClick={() => refetch()}
        size="sm"
        radius="lg"
        className="text-md font-bold"
      >
        Retry
      </Button>
    </div>
  );
};
