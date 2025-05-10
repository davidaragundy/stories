import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";

export const ActiveSessionCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center gap-2">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-5 w-16" />
        </CardTitle>

        <CardDescription>
          <Skeleton className="h-4 w-64" />
        </CardDescription>
      </CardHeader>

      <CardContent className="text-sm flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-32" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40" />
        </div>

        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-40" />
        </div>
      </CardContent>

      <CardFooter>
        <Skeleton className="h-8 w-24" />
      </CardFooter>
    </Card>
  );
};
