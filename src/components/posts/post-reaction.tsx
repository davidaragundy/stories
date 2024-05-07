"use client";

import { Button, ButtonProps } from "@nextui-org/button";
import toast from "react-hot-toast";
import { PostReactionModal, Toast } from "@/components";
import { cn } from "@/utils";
import { Reaction as IReaction } from "@/types";
import { ReactNode } from "react";
import {
  usePageState,
  usePostState,
  useUpdatePostReactionMutation,
} from "@/hooks";
import { useDisclosure } from "@nextui-org/modal";

interface Props {
  reaction: IReaction;
  count: number;
  icon: ReactNode;
  color: ButtonProps["color"];
}

export const PostReaction = ({ reaction, count, icon, color }: Props) => {
  const { user } = usePageState();
  const { isPending, reactionsSet } = usePostState();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { mutateAsync } = useUpdatePostReactionMutation();

  const handleReaction = async () => {
    const { ok, messages } = await mutateAsync(reaction);

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
          disabled={isPending}
          className={cn(
            "text-default-500",
            reactionsSet.has(`${user!.id}-${reaction}`) &&
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
        <PostReactionModal
          isOpen={isOpen}
          onClose={onClose}
          icon={icon}
          color={color}
          reaction={reaction}
        />
      )}
    </>
  );
};
