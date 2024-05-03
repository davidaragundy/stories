"use client";

import { TrashIcon } from "@/icons";
import { Button } from "@nextui-org/button";
import toast from "react-hot-toast";
import { Toast } from "@/components";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/modal";
import { useDeleteCommentMutation } from "@/hooks";

export const DeleteCommentButton = ({
  commentId,
  postId,
  queryKey,
}: {
  commentId: string;
  postId: string;
  queryKey: string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { isPending, mutateAsync } = useDeleteCommentMutation(queryKey);

  const handleDelete = async () => {
    const { ok, messages } = await mutateAsync({ commentId, postId });

    !ok &&
      toast.custom(
        (props) => (
          <Toast {...props} message={messages.toString()} variant={"danger"} />
        ),
        { duration: 3000 },
      );
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-end">
        <Button
          isLoading={isPending}
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-default-500 hover:text-danger"
          type="submit"
          onClick={onOpen}
        >
          <TrashIcon size={14} />
        </Button>
      </div>
      <Modal
        backdrop={"blur"}
        isOpen={isOpen}
        onClose={onClose}
        className="rounded-3xl"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete comment 🤮
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this comment? This action is
                  irreversible.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    onClose();
                    handleDelete();
                  }}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
