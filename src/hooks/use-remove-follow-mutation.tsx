"use client";

import { removeFollowAction } from "@/actions";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { FollowsData, ProfileData } from "@/types";
import { usePageState } from "@/hooks";

interface MutationProps {
  userId: string;
  username: string;
}

export const useRemoveFollowMutation = () => {
  const { user } = usePageState();

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ userId }: MutationProps) =>
      await removeFollowAction(userId),
    onMutate: async ({ userId }) => {
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["profile", user!.username, "info"],
        }),
        queryClient.cancelQueries({
          queryKey: ["profile", user!.username, "info", "followers"],
        }),
      ]);

      const previousData = queryClient.getQueryData<ProfileData>([
        "profile",
        user!.username,
        "info",
      ]);

      const previousFollowsData = queryClient.getQueryData<FollowsData[]>([
        "profile",
        user!.username,
        "info",
        "followers",
      ]);

      queryClient.setQueryData(
        ["profile", user!.username, "info"],
        (old: ProfileData) => ({
          ...old,
          followersCount: old.followersCount - 1,
          followers: old.followers.filter(
            (follow) => follow.followerId != user!.id,
          ),
        }),
      );

      queryClient.setQueryData(
        ["profile", user!.username, "info", "followers"],
        (old: FollowsData[]) =>
          old.filter((follow) => follow.user.id !== userId),
      );

      return { previousData, previousFollowsData };
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(
        ["profile", user!.username, "info"],
        context?.previousData,
      );

      queryClient.setQueryData(
        ["profile", user!.username, "info", "followers"],
        context?.previousFollowsData,
      );
    },
    onSettled: (_data, _error, { username }) => {
      queryClient.invalidateQueries({
        queryKey: ["profile", user!.username, "info"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", user!.username, "info", "followers"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", username, "info"],
      });

      queryClient.invalidateQueries({
        queryKey: ["profile", username, "info", "following"],
      });
    },
  });

  return mutation;
};
