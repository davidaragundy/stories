"use client";

import { getProfileDataAction } from "@/actions/get-profile-data";
import { useFollowMutation, usePageState } from "@/hooks";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Toast, FollowButtonError } from "@/components";

export const FollowButton = () => {
  const { user, profile } = usePageState();

  const { data, isPending, isError } = useQuery({
    queryKey: ["profile", profile?.username, "info"],
    queryFn: async () => await getProfileDataAction(profile!.username),
  });

  const { mutateAsync } = useFollowMutation();

  if (isError) return <FollowButtonError />;

  if (!data) return null;

  const isFollowing =
    data.followers.findIndex((follow) => follow.followerId === user!.id) !== -1;

  const handleFollow = async () => {
    const { ok, messages } = await mutateAsync(data.id);

    if (!ok) {
      toast.custom(
        (props) => (
          <Toast {...props} message={messages.toString()} variant="danger" />
        ),
        { duration: 3000 },
      );
    }
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
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
};
