"use client";

import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { authClient } from "@/shared/lib/better-auth/client";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
      if (error.status !== 429) return;

      toast.error("Something went wrong, please try again later 😢");
      return;
    }

    router.push("/sign-in");
  };

  return (
    <Button
      variant="ghost"
      title="Sign out"
      aria-label="Sign out"
      size="icon"
      onClick={handleSignOut}
    >
      <LogOutIcon />
    </Button>
  );
};
