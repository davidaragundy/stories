"use client";

import { updateReactionAction } from "@/actions";
import { Button, ButtonProps } from "@nextui-org/button";
import toast from "react-hot-toast";
import { Toast } from "@/components";
import { cn } from "@/utils";
import { Reaction } from "@/types";
import { useOptimistic } from "react";

export const PostReaction = ({
  reaction,
  count,
  icon,
  color,
  postId,
  reactionsSet,
  userId,
}: {
  reaction: Reaction;
  count: number;
  icon: React.ReactNode;
  color: ButtonProps["color"];
  postId: string;
  reactionsSet: Set<string>;
  userId: string;
}) => {
  const [optimisticCount, setOptimisticCount] = useOptimistic<number, void>(
    count,
    (state) => {
      if (reactionsSet.has(`${userId}-${reaction}`)) {
        reactionsSet.delete(`${userId}-${reaction}`);
        return state - 1;
      }

      reactionsSet.add(`${userId}-${reaction}`);
      return state + 1;
    },
  );

  const handleReaction = async () => {
    setOptimisticCount();

    const { ok, messages } = await updateReactionAction(
      "post",
      postId,
      reaction,
    );

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
    <div className="flex items-center gap-1 text-default-500">
      <Button
        className={cn(
          "text-default-500",
          reactionsSet.has(`${userId}-${reaction}`) &&
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
      <span>{optimisticCount}</span>
    </div>
  );
};
