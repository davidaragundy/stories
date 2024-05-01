import { Skeleton } from "@nextui-org/skeleton";

export const PostSkeleton = () => {
  return (
    <div className="flex w-[clamp(10rem,60%,30rem)] flex-col gap-4 rounded-[2rem] bg-default-50 p-4">
      <div className="flex items-center gap-5">
        <Skeleton className="aspect-square w-12 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-5 w-2/5 rounded-full" />
          <Skeleton className="h-2 w-1/5 rounded-full" />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-full rounded-full" />
        <Skeleton className="h-4 w-1/2 rounded-full" />
      </div>

      <Skeleton className="aspect-square w-full rounded-2xl" />
    </div>
  );
};
