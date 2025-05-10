import { Skeleton } from "@/shared/components/ui/skeleton";

export const NavUserSkeleton = () => {
  return (
    <div className="w-full flex flex-wrap items-center gap-4">
      <div className="relative">
        <Skeleton className="size-10 rounded-full">
          <span className="sr-only">Avatar loading</span>
        </Skeleton>
        <span className="border-background absolute -end-0.5 -bottom-0.5 size-3 rounded-full border-2 bg-emerald-500">
          <span className="sr-only">Online</span>
        </span>
      </div>

      <div className="hidden sm:flex flex-col gap-1">
        <Skeleton className="h-4 w-24">
          <span className="sr-only">Name loading</span>
        </Skeleton>
        <Skeleton className="h-3 w-20">
          <span className="sr-only">Username loading</span>
        </Skeleton>
      </div>

      <Skeleton className="size-9 rounded-full hidden sm:flex">
        <span className="sr-only">Menu button loading</span>
      </Skeleton>
    </div>
  );
};
