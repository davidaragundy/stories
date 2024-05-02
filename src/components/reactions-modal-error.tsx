"use client";

import { Button } from "@nextui-org/button";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";

export const ReactionsModalError = ({
  refetch,
}: {
  refetch: (options?: RefetchOptions) => Promise<
    QueryObserverResult<
      {
        type: string;
        userId: string;
        postId: string;
        user: {
          id: string;
          firstName: string;
          lastName: string;
          username: string;
          avatarUrl: string;
        };
      }[],
      Error
    >
  >;
}) => {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p>Something went wrong while fetching the reactions 😭</p>
      <Button color="danger" onClick={() => refetch()}>
        Retry
      </Button>
    </div>
  );
};
