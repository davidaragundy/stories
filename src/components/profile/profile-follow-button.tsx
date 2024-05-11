"use client";

import { getProfileDataAction } from "@/actions/get-profile-data";
import { useProfileFollowMutation, usePageState } from "@/hooks";
import { Button } from "@nextui-org/button";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Toast, ProfileFollowButtonError } from "@/components";

export const ProfileFollowButton = () => {
  const { user, profile } = usePageState();

  const { data, isPending, isError } = useQuery({
    queryKey: ["profile", profile!.username, "info"],
    queryFn: async () => await getProfileDataAction(profile!.username),
  });

  const { mutateAsync } = useProfileFollowMutation();

  if (isError) return <ProfileFollowButtonError />;

  if (!data || user!.username === profile!.username) return null;

  const isFollowing =
    data.followers.findIndex((follow) => follow.followerId === user!.id) > -1;

  const handleFollow = async () => {
    const { ok, messages } = await mutateAsync(data.id);

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
