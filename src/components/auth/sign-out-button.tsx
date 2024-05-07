"use client";

import { signOutAction } from "@/actions";
import { LogOutIcon } from "@/icons";
import { cn } from "@/utils";
import { Button } from "@nextui-org/button";

export const SignOutButton = ({ showText }: { showText?: boolean }) => {
  return (
    <form action={signOutAction}>
      <Button
        isIconOnly={!showText}
        variant={showText ? "solid" : "light"}
        color="danger"
        radius={showText ? "none" : "full"}
        type="submit"
        size={showText ? "sm" : "md"}
        className={cn(
          showText
            ? "m-0 bg-transparent p-0 text-lg text-danger"
            : "text-default-500 hover:text-danger",
        )}
      >
        {showText ? "Sign out" : <LogOutIcon size={22} />}
      </Button>
    </form>
  );
};
