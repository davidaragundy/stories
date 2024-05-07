"use client";

import { getProfileDataAction } from "@/actions";
import { usePageState } from "@/hooks";
import { useQuery } from "@tanstack/react-query";
import {
  ProfileInfoCard,
  ProfileInfoError,
  ProfileInfoSkeleton,
} from "@/components";
import { ComponentProps } from "react";

export const ProfileInfo = () => {
  const { profile } = usePageState();

  const { data, isPending, isError } = useQuery({
    queryKey: ["profile", profile?.username, "info"],
    queryFn: async () => await getProfileDataAction(profile!.username),
  });

  if (isPending) return <ProfileInfoSkeleton />;

  if (isError) return <ProfileInfoError />;

  const cardsProps: ComponentProps<typeof ProfileInfoCard>[] = [
    { count: data.followersCount, label: "followers" },
    { count: data.followingsCount, label: "following" },
  ];

  return (
    <div className="flex items-center gap-2 rounded-3xl bg-default-100 p-2 text-center">
      <div className="flex flex-col items-center rounded-2xl p-2 hover:bg-default-200">
        <span className="text-xl font-bold">{data.postsCount}</span>

        <span className="text-sm text-default-500">posts</span>
      </div>

      {cardsProps.map((props) => (
        <ProfileInfoCard key={props.label} {...props} />
      ))}
    </div>
  );
};
