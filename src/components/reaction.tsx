"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import toast from "react-hot-toast";
import { ReactionsModal, Toast } from "@/components";
import { cn } from "@/utils";
import { Reaction as IReaction } from "@/types";
import { ReactNode } from "react";
import { useUpdateReactionMutation } from "@/hooks";
import { useDisclosure } from "@nextui-org/modal";

export const Reaction = ({
  reaction,
  count,
  icon,
  color,
  target,
  targetId,
  reactionsSet,
  userId,
}: {
  reaction: IReaction;
  count: number;
  icon: ReactNode;
  color: ButtonProps["color"];
  target: "post" | "comment";
  targetId: string;
  reactionsSet: Set<string>;
  userId: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync } = useUpdateReactionMutation();

  const handleReaction = async () => {
    const { ok, messages } = await mutateAsync({
      target,
      targetId,
      reaction,
      userId,
    });

    if (!ok) {
      toast.custom(
        (props) => (
          <Toast {...props} message={messages.toString()} variant="danger" />
        ),
        { duration: 3000 },
      );
    }
  };

  return (
    <>
      <div className="flex items-center gap-1 text-default-500">
        <Button
          className={cn(
            "text-default-500",
            reactionsSet.has(`${targetId}-${userId}-${reaction}`) &&
              (color === "warning"
                ? "text-warning"
                : color === "secondary"
                  ? "text-secondary"
                  : "text-primary"),
          )}
          color={color}
          variant={"light"}
          isIconOnly
          radius="full"
          size="sm"
          onClick={handleReaction}
        >
          {icon}
        </Button>
        <span className="hover:cursor-pointer hover:underline" onClick={onOpen}>
          {count}
        </span>
      </div>

      {isOpen && (
        <ReactionsModal
          isOpen={isOpen}
          onClose={onClose}
          icon={icon}
          color={color}
          targetId={targetId}
          reaction={reaction}
        />
      )}
    </>
  );
};
