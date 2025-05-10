import { useQuery } from "@tanstack/react-query";

import { authClient } from "@/shared/lib/better-auth/client";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";

export const useSession = () =>
  useQuery({
    queryKey: [SESSION_QUERY_KEY],
    queryFn: async () => {
      const { data, error } = await authClient.getSession();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
