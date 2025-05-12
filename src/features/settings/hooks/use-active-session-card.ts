import { useRevokeSessionMutation } from "@/features/settings/hooks/use-revoke-session-mutation";

export const useActiveSessionCard = () => {
  const { mutate } = useRevokeSessionMutation();

  const handleRevokeSession = (token: string) => mutate(token);

  return { handleRevokeSession };
};
