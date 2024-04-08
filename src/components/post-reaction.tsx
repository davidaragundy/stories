"use client";

import { updateReactionAction } from "@/actions";
import { Button, ButtonProps } from "@nextui-org/button";
import toast from "react-hot-toast";
import { Toast } from ".";

export const PostReaction = ({
  reaction,
  count,
  icon,
  color,
  postId,
}: {
  reaction: "fire" | "poop" | "cap";
  count: number;
  icon: React.ReactNode;
  color: ButtonProps["color"];
  postId: string;
}) => {
  const handleReaction = async () => {
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
        { duration: 7000 },
      );
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
