"use client";

import { Modal, ModalContent, ModalHeader, ModalBody } from "@nextui-org/modal";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { DateTime } from "luxon";
import { Avatar } from "@nextui-org/avatar";
import { useQuery } from "@tanstack/react-query";
import { getFollowsAction } from "@/actions";
import {
  ProfileInfoModalSkeleton,
  ProfileInfoModalError,
  UserFollowButton,
  RemoveFollowButton,
} from "@/components";
import { useRouter } from "next/navigation";
import { usePageState } from "@/hooks";

interface Props {
  target: "followers" | "following";
  isOpen: boolean;

  onClose: () => void;
}

export const ProfileInfoModal = ({ target, isOpen, onClose }: Props) => {
  const { user, profile } = usePageState();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["profile", profile!.username, "info", target],
    queryFn: async () => await getFollowsAction(profile!.username, target),
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
            <ModalHeader className="flex items-center gap-2 pl-3 sm:pl-6">
              <h3 className="font-bold">{target}</h3>
              <span>({isLoading ? "🫣" : data?.length || 0})</span>
            </ModalHeader>
            <ModalBody className="p-0 sm:px-6 sm:py-2">
              {isLoading && <ProfileInfoModalSkeleton />}

              {isError && <ProfileInfoModalError target={target} />}

              {data && (
                <Listbox
                  classNames={{
                    list: "max-h-[400px] overflow-y-auto overflow-x-hidden",
                  }}
                  label="Users that reacted to this post"
                  items={data}
                  variant="flat"
                >
                  {(follow) => (
                    <ListboxItem
                      className="cursor-pointer rounded-3xl"
                      key={follow.user.id}
                      textValue={follow.user.username}
                      onClick={() => router.push(`/${follow.user.username}`)}
                    >
                      <div className="flex items-center gap-2">
                        <Avatar
                          alt={`${follow.user.firstName} ${follow.user.lastName}`}
                          className="flex-shrink-0"
                          size="sm"
                          src={follow.user.avatarUrl}
                        />

                        <div className="flex flex-1 flex-col">
                          <div className="flex items-center gap-2">
                            <span className="text-small">
                              {follow.user.firstName} {follow.user.lastName}
                            </span>

                            <span className="text-tiny text-default-400">
                              {DateTime.fromMillis(
                                follow.followCreatedAt,
                              ).toRelative({
                                locale: "en",
                              })}
                            </span>
                          </div>

                          <span className="text-tiny text-default-400">
                            {follow.user.username}
                          </span>
                        </div>

                        {profile!.username === user!.username &&
                        target === "followers" ? (
                          <RemoveFollowButton
                            id={follow.user.id}
                            username={follow.user.username}
                          />
                        ) : (
                          <UserFollowButton
                            id={follow.user.id}
                            username={follow.user.username}
                          />
                        )}
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
