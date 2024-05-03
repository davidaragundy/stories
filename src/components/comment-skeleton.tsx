import { Skeleton } from "@nextui-org/skeleton";

export const CommentSkeleton = () => {
  return (
    <div className="flex w-full gap-3">
      <div>
        <Skeleton className="aspect-square w-10 rounded-full" />
      </div>

      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-1">
          <Skeleton className="h-4 w-2/5 rounded-md" />
          <Skeleton className="h-2 w-1/5 rounded-md" />
        </div>
        <Skeleton className="h-8 w-full rounded-xl" />
      </div>
    </div>
  );
};
