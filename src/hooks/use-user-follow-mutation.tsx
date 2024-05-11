"use client";

import { followAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FollowsData, ProfileData } from "@/types";
import { usePageState } from "@/hooks";

interface MutationProps {
  userId: string;
  username: string;
}

export const useUserFollowMutation = () => {
  const { user, profile } = usePageState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userId }: MutationProps) => await followAction(userId),
    onMutate: async ({ userId }) => {
      await queryClient.cancelQueries({
        queryKey: ["profile", user!.username, "info"],
      });

      const previousUserData = queryClient.getQueryData<ProfileData>([
        "profile",
        user!.username,
        "info",
      ]);

      const previousFollowingData = queryClient.getQueryData<FollowsData[]>([
        "profile",
        user!.username,
        "info",
        "following",
      ]);

      queryClient.setQueryData(
        ["profile", user!.username, "info"],
        (old: ProfileData) => {
          const isAlreadyFollowing =
            old.followings.findIndex(
              (follow) => follow.followingId === userId,
            ) > -1;

          return {
            ...old,
            followingsCount: isAlreadyFollowing
              ? old.followingsCount - 1
              : old.followingsCount + 1,
            followings: isAlreadyFollowing
              ? old.followings.filter((follow) => follow.followingId != userId)
              : [
                  ...old.followings,
                  {
                    id: Date.now(),
                    followerId: user!.id,
                    followingId: userId,
                    createdAt: Date.now(),
                  },
                ],
          };
        },
      );

      if (profile!.username === user!.username)
        queryClient.setQueryData(
          ["profile", user!.username, "info", "following"],
          (old: FollowsData[]) => {
            const isFollowing =
              old.findIndex((follow) => follow.user.id === userId) > -1;

            return isFollowing
              ? old.filter((follow) => follow.user.id != userId)
              : [
                  ...old,
                  {
                    followCreatedAt: Date.now(),
                    user: {
                      id: user!.id,
                      username: user!.username,
                      avatarUrl: user!.avatarUrl,
                      firstName: user!.firstName,
                      lastName: user!.lastName,
                    },
                  } satisfies FollowsData,
                ];
          },
        );

      return { previousUserData, previousFollowingData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["profile", user!.username, "info"],
        context?.previousUserData,
      );

      if (profile!.username === user!.username)
        queryClient.setQueryData(
          ["profile", user!.username, "info", "following"],
          context?.previousFollowingData,
        );
    },
    onSettled: (_data, _error, { username }) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user!.username, "info"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", user!.username, "info", "following"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", username, "info"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", username, "info", "followers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["following", "posts"],
      });
    },
  });

  return mutation;
};
