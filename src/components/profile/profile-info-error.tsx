"use client";

import { usePageState } from "@/hooks";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";

export const ProfileInfoError = () => {
  const { profile } = usePageState();

  const { refetch, isRefetching } = useQuery({
    queryKey: ["profile", profile?.username, "info"],
  });

  return (
    <div className="flex flex-col items-center gap-2">
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
