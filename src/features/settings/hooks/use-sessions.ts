import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/shared/lib/better-auth/client";

import { SESSIONS_QUERY_KEY } from "@/features/settings/lib/react-query/query-keys";

export const useSessions = () =>
  useQuery({
    queryKey: [SESSIONS_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await authClient.listSessions();

      if (error) return Promise.reject(error);

      return data;
    },
  });
