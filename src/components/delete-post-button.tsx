"use client";

import { deletePostAction } from "@/actions";
import { TrashIcon } from "@/icons";
import { Button } from "@nextui-org/button";
import { useState } from "react";
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

export const DeletePostButton = ({ postId }: { postId: string }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);

    try {
      const { ok, messages } = await deletePostAction(postId);

      toast.custom(
        (props) => (
          <Toast
            {...props}
            message={messages.toString()}
            variant={ok ? "success" : "danger"}
          />
        ),
        { duration: 7000 },
      );
    } catch (error) {
      toast.custom(
        (props) => (
          <Toast
            {...props}
            message="An error occurred while deleting the post 😢"
            variant="danger"
          />
        ),
        { duration: 7000 },
      );
    }

    setLoading(false);
  };

  return (
    <>
      {" "}
      <div className="flex flex-wrap items-start justify-end">
        <Button
          isLoading={loading}
          isIconOnly
          variant="light"
          size="sm"
          radius="full"
          className="text-default-500 hover:text-danger"
          type="submit"
          onClick={onOpen}
        >
          <TrashIcon size={18} />
        </Button>
      </div>
      <Modal backdrop={"blur"} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Delete post 🤮
              </ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete this post? This action is
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
