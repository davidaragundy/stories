"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button, ButtonProps } from "@nextui-org/button";
import { ReactNode } from "react";
import { cn } from "@/utils";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import { useQuery } from "@tanstack/react-query";
import { Reaction } from "@/types";
import { getPostReactionsAction } from "@/actions";
import {
  PostReactionModalSkeleton,
  PostReactionModalError,
} from "@/components";
import { useRouter } from "next/navigation";
import { usePostState } from "@/hooks";

interface Props {
  isOpen: boolean;
  icon: ReactNode;
  color: ButtonProps["color"];
  reaction: Reaction;

  onClose: () => void;
}

export const PostReactionModal = ({
  isOpen,
  onClose,
  icon,
  color,
  reaction,
}: Props) => {
  const { id } = usePostState();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["post", id, "reactions", reaction],
    queryFn: async () =>
      await getPostReactionsAction({
        postId: id,
        reaction,
      }),
  });

  const router = useRouter();

  return (
    <Modal
      backdrop={"blur"}
      isOpen={isOpen}
      onClose={onClose}
      className="rounded-3xl"
    >
      <ModalContent>
        {(_onClose) => (
          <>
            <ModalHeader className="flex items-center">
              <Button
                className={cn(
                  "hover:bg-transparent",
                  color === "warning"
                    ? "text-warning"
                    : color === "secondary"
                      ? "text-secondary"
                      : "text-primary",
                )}
                color={color}
                variant={"light"}
                isIconOnly
                radius="full"
                size="sm"
                disabled
              >
                {icon}
              </Button>
              <span>({isLoading ? "🫣" : data?.length || 0})</span>
            </ModalHeader>
            <ModalBody>
              {isLoading && <PostReactionModalSkeleton />}

              {isError && <PostReactionModalError reaction={reaction} />}

              {data && (
                <Listbox
                  classNames={{
                    list: "max-h-[400px] overflow-y-auto overflow-x-hidden",
                  }}
                  label="Users that reacted to this post"
                  items={data}
                  variant="flat"
                >
                  {(reaction) => (
                    <ListboxItem
                      className="cursor-pointer rounded-2xl"
                      key={reaction.userId}
                      textValue={reaction.user.username}
                      onClick={() => router.push(`/${reaction.user.username}`)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          alt={`${reaction.user.firstName} ${reaction.user.lastName}`}
                          className="flex-shrink-0"
                          size="sm"
                          src={reaction.user.avatarUrl}
                        />
                        <div className="flex flex-col">
                          <span className="text-small">
                            {reaction.user.firstName} {reaction.user.lastName}
                          </span>
                          <span className="text-tiny text-default-400">
                            {reaction.user.username}
                          </span>
                        </div>
                      </div>
                    </ListboxItem>
                  )}
                </Listbox>
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
