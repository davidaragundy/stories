"use client";

import { updateReactionCountAction } from "@/actions";
import { Post, Reactions } from "@/types";
import { Button, ButtonProps } from "@nextui-org/button";

export const PostReaction = ({
  reaction,
  count,
  icon,
  color,
  post,
}: {
  reaction: keyof Reactions;
  count: number;
  icon: React.ReactNode;
  color: ButtonProps["color"];
  post: Post;
}) => {
  const handleReaction = async () => {
    try {
      const { ok, messages } = await updateReactionCountAction(post, reaction);

      console.log({ ok, messages });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center gap-1 text-default-500">
      <Button
        className="text-default-500"
        color={color}
        variant="light"
        isIconOnly
        radius="full"
        size="sm"
        onClick={handleReaction}
      >
        {icon}
      </Button>
      <span>{count}</span>
    </div>
  );
};
