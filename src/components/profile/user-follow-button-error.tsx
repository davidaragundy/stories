"use client";

import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";

interface Props {
  username: string;
}

export const UserFollowButtonError = ({ username }: Props) => {
  const { isRefetching, refetch } = useQuery({
    queryKey: ["profile", username, "info"],
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
