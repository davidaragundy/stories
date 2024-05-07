"use client";

import { Skeleton } from "@nextui-org/skeleton";

export const PostReactionModalSkeleton = () => {
  return (
    <div className="flex flex-col gap-2">
      {[1, 2, 3].map((i) => (
        <div
          className="flex w-full items-center gap-2"
          key={`${Date.now()}-${i}`}
        >
          <Skeleton className="aspect-square w-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-2/5 rounded-full" />

            <Skeleton className="h-2 w-1/5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};
