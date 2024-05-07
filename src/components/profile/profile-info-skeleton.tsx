"use client";

import { Skeleton } from "@nextui-org/skeleton";

export const ProfileInfoSkeleton = () => {
  return (
    <div className="flex items-center gap-2 rounded-3xl bg-default-100 p-2 text-center">
      <div className="flex flex-col items-center rounded-2xl p-2">
        <Skeleton className="rounded-full">
          <span className="text-xl font-bold">0</span>
        </Skeleton>

        <span className="text-sm text-default-500">posts</span>
      </div>

      <div className="flex flex-col items-center rounded-2xl p-2 hover:cursor-pointer">
        <Skeleton className="rounded-full">
          <span className="text-xl font-bold">0</span>
        </Skeleton>

        <span className="text-sm text-default-500">followers</span>
      </div>

      <div className="flex flex-col items-center rounded-2xl p-2 hover:cursor-pointer">
        <Skeleton className="rounded-full">
          <span className="text-xl font-bold">0</span>
        </Skeleton>

        <span className="text-sm text-default-500">following</span>
      </div>
    </div>
  );
};
