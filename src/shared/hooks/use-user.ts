import { useQuery } from "@tanstack/react-query";

import { getUser } from "@/shared/actions/get-user";

interface Props {
  id?: string;
  username?: string;
}

export const useUser = ({ id, username }: Props) => {
  if (!id && !username)
    throw new Error("Either id or username is required in useUser");

  return useQuery({
    queryKey: ["user", "detail", id, username],
    queryFn: async () => {
      const { data, error } = await getUser({ id, username });

      if (error) throw new Error(error.message);

      return data;
    },
  });
};
