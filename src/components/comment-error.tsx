"use client";

import { FullComment } from "@/types";
import { Button } from "@nextui-org/button";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export const CommentError = ({
  refetch,
}: {
  refetch: (
    options?: RefetchOptions,
  ) => Promise<QueryObserverResult<FullComment[], Error>>;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 p-4 text-center">
      <p>Something went wrong while fetching the comments. 😭</p>
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
