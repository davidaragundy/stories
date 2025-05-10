import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { authClient } from "@/shared/lib/better-auth/client";
import type { Session } from "@/shared/types";

import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";

export const useActiveSessionCard = () => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation({
    mutationFn: async (token: string) => {
      const { error } = await authClient.revokeSession({
        token,
      });

      if (error) {
        throw new Error(error.message);
      }
    },
    // When mutate is called:
    onMutate: async (token) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: [SESSIONS_QUERY_KEY] });

      // Snapshot the previous value
      const previousSessions = queryClient.getQueryData<Session["session"][]>([
        SESSIONS_QUERY_KEY,
      ]);

      // Optimistically update to the new value
      queryClient.setQueryData(
        [SESSIONS_QUERY_KEY],
        (old: Session["session"][]) =>
          old.filter((session) => session.token !== token)
      );

      // Return a context object with the snapshotted value
      return { previousSessions };
    },
    onSuccess: () => {
      toast.success("Session revoked successfully 🎉");
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (_error, _token, context) => {
      queryClient.setQueryData([SESSIONS_QUERY_KEY], context?.previousSessions);

      toast.error("Failed to revoke session, please try again later 😢");
    },
    // Always refetch after error or success:
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: [SESSIONS_QUERY_KEY] }),
  });

  const handleRevokeSession = mutate;

  return { handleRevokeSession };
};
