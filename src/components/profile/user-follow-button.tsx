"use client";

import { useUserFollowMutation, usePageState } from "@/hooks";
import { Button } from "@nextui-org/button";
import toast from "react-hot-toast";
import { Toast, UserFollowButtonError } from "@/components";
import { useQuery } from "@tanstack/react-query";
import { getProfileDataAction } from "@/actions";

interface Props {
  id: string;
  username: string;
}

export const UserFollowButton = ({ username, id }: Props) => {
  const { user } = usePageState();

  const { data, isPending, isError } = useQuery({
    queryKey: ["profile", user!.username, "info"],
    queryFn: async () => await getProfileDataAction(user!.username),
  });

  const { mutateAsync } = useUserFollowMutation();

  if (isError) return <UserFollowButtonError username={username} />;

  if (!data || user!.username === username) return null;

  const isFollowing =
    data.followings.findIndex((follow) => follow.followingId === id) > -1;

  const handleFollow = async () => {
    const { ok, messages } = await mutateAsync({
      userId: id,
      username,
    });

    if (!ok)
      toast.custom(
        (props) => (
          <Toast {...props} message={messages.toString()} variant="danger" />
        ),
        { duration: 3000 },
      );
  };

  return (
    <Button
      isLoading={isPending}
      onClick={handleFollow}
      radius="lg"
      size="sm"
      className="font-bold"
      variant="flat"
      color={isFollowing ? "danger" : "primary"}
    >
      {isFollowing ? "unfollow" : "follow"}
    </Button>
  );
};
