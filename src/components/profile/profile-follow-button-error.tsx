"use client";

import { usePageState } from "@/hooks";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";

export const ProfileFollowButtonError = () => {
  const { profile } = usePageState();

  const { isRefetching, refetch } = useQuery({
    queryKey: ["profile", profile?.username, "info"],
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
