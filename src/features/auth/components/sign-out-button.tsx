"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/shared/components";
import { authClient } from "@/shared/lib/auth/client";

import { LogOutIcon } from "lucide-react";
import { toast } from "sonner";

export const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();

    if (error) {
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
