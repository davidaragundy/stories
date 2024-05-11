"use client";

import { useRemoveFollowMutation } from "@/hooks";
import { Button } from "@nextui-org/button";
import toast from "react-hot-toast";
import { Toast } from "@/components";

interface Props {
  id: string;
  username: string;
}

export const RemoveFollowButton = ({ username, id }: Props) => {
  const { mutateAsync } = useRemoveFollowMutation();

  const handleRemove = async () => {
    const { ok, messages } = await mutateAsync({
      userId: id,
      username,
    });

    if (!ok)
      toast.custom(
        (props) => (
          <Toast {...props} message={messages.toString()} variant="danger" />
        ),
        { duration: 3000 },
      );
  };

  return (
    <Button
      onClick={handleRemove}
      radius="lg"
      size="sm"
      className="font-bold"
      variant="flat"
      color={"danger"}
    >
      remove
    </Button>
  );
};
