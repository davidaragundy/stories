"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Button, ButtonProps } from "@nextui-org/button";
import { ReactNode } from "react";
import { cn } from "@/utils";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Avatar } from "@nextui-org/avatar";
import { useQuery } from "@tanstack/react-query";
import { Reaction } from "@/types";
import { getReactionsAction } from "@/actions";
import { ReactionsModalSkeleton } from "@/components";
import { ReactionsModalError } from "./reactions-modal-error";
import { useRouter } from "next/navigation";

export const ReactionsModal = ({
  isOpen,
  onClose,
  icon,
  color,
  targetId,
  reaction,
}: {
  isOpen: boolean;
  onClose: () => void;
  icon: ReactNode;
  color: ButtonProps["color"];
  targetId: string;
  reaction: Reaction;
}) => {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["reactions", reaction, targetId],
    queryFn: async () => await getReactionsAction(reaction, targetId),
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
              {isLoading && <ReactionsModalSkeleton />}

              {isError && <ReactionsModalError refetch={refetch} />}

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
