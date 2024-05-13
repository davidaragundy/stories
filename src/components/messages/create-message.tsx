"use client";

import { ImageIcon, SendIcon, XIcon } from "@/icons";
import { Avatar } from "@nextui-org/avatar";
import { Textarea } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useEffect, useReducer, useRef } from "react";
import { getDatabase, push, ref as dbRef, set } from "firebase/database";
import type {
  CreateMessageInputs,
  Message,
  MessageMedia,
  UploadedFilesResponse,
} from "@/types";
import { usePageState } from "@/hooks";
import Image from "next/image";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createMessageSchema } from "@/validation";
import toast from "react-hot-toast";
import { Toast } from "@/components";
import { cn, removeFiles, removeUnpostedFiles, uploadFiles } from "@/utils";
import { getMessagesRef } from "@/lib/firebase";

interface Props {
  chatUser: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    avatarUrl: string;
  };
}

interface CreateMessageState {
  mediaUrl?: string;
  mediaType?: "image" | "video";
  isFileLoading: boolean;
  uploadedFiles: UploadedFilesResponse[];
  isPending: boolean;
}

export const CreateMessage = ({ chatUser }: Props) => {
  const { user: authUser } = usePageState();

  const [state, dispatch] = useReducer(
    (state: CreateMessageState, newState: Partial<CreateMessageState>) => ({
      ...state,
      ...newState,
    }),
    {
      isFileLoading: false,
      uploadedFiles: [],
      isPending: false,
    },
  );

  const { mediaUrl, mediaType, isFileLoading, uploadedFiles, isPending } =
    state;

  const mediaRef = useRef<HTMLInputElement | null>(null);

  const { register, handleSubmit, getValues, reset, watch } =
    useForm<CreateMessageInputs>({
      resolver: zodResolver(createMessageSchema),
      defaultValues: {
        userId: authUser!.id,
      },
    });

  const { ref, ...registerMedia } = register("media");

  const media = watch("media");

  useEffect(() => {
    (async () => {
      if (media && media.length) {
        if (media[0].size > 4.5 * 10 ** 6) {
          toast.custom(
            (props) => (
              <Toast
                {...props}
                message="The file is too large. Max size is 4.5MB. 😠"
                variant="danger"
              />
            ),
            { duration: 3000 },
          );

          return;
        }

        let url = URL.createObjectURL(media[0]);

        dispatch({
          mediaUrl: url,
          mediaType: media[0].type.includes("image") ? "image" : "video",
          isFileLoading: true,
        });

        const uploadedFiles = await uploadFiles(
          getMessagesRef({
            authUserId: authUser!.id,
            userId: chatUser.id,
          }),
          media,
        );

        dispatch({
          uploadedFiles,
        });

        sessionStorage.setItem(
          "uploadedFiles",
          JSON.stringify(uploadedFiles.map((file) => file.id)),
        );

        URL.revokeObjectURL(url);
        url = uploadedFiles[0].url;

        dispatch({
          mediaUrl: url,
          isFileLoading: false,
        });
      }
    })();

    window.onbeforeunload = () =>
      removeUnpostedFiles(
        getMessagesRef({
          authUserId: authUser!.id,
          userId: chatUser.id,
        }),
      );

    return () => {
      window.onbeforeunload = null;

      removeUnpostedFiles(
        getMessagesRef({
          authUserId: authUser!.id,
          userId: chatUser.id,
        }),
      );
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  //TODO: file or files? decide 🫵
  const onRemoveFile = async () => {
    dispatch({
      isFileLoading: true,
    });

    try {
      await removeFiles(
        getMessagesRef({
          authUserId: authUser!.id,
          userId: chatUser.id,
        }),
        uploadedFiles.map((file) => file.id),
      );

      sessionStorage.removeItem("uploadedFiles");
    } catch (error) {
      toast.custom(
        (props) => (
          <Toast
            {...props}
            message="Something went wrong while deleting the file. 😭"
            variant="danger"
          />
        ),
        { duration: 3000 },
      );
    }

    dispatch({
      mediaUrl: undefined,
      mediaType: undefined,
      uploadedFiles: [],
      isFileLoading: false,
    });

    mediaRef.current!.value = "";
    mediaRef.current!.files = null;
  };

  const onSubmit: SubmitHandler<CreateMessageInputs> = async (data) => {
    if (!getValues("content") && !uploadedFiles.length) {
      return;
    }

    dispatch({
      isPending: true,
    });

    const db = getDatabase();
    const messagesRef = dbRef(
      db,
      "messages/" + [authUser!.id, chatUser.id].sort().join("-"),
    );
    const newMessageRef = push(messagesRef);

    const messageCreatedAt = Date.now();

    const mediaToSubmit: MessageMedia[] = uploadedFiles.map((file) => ({
      ...file,
      messageCreatedAt,
      messageId: newMessageRef.key!,
    }));

    const dataToSubmit = {
      ...data,
      media: mediaToSubmit,
      id: newMessageRef.key!,
      createdAt: messageCreatedAt,
    } satisfies Message;

    set(newMessageRef, dataToSubmit);

    reset();

    dispatch({
      mediaType: undefined,
      mediaUrl: undefined,
      uploadedFiles: [],
      isPending: false,
    });

    sessionStorage.removeItem("uploadedFiles");
  };

  return (
    <form
      className="mt-4 flex w-full flex-initial gap-3"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-start">
        <Avatar
          name={`${authUser!.firstName} ${authUser!.lastName}`}
          src={authUser!.avatarUrl}
        />
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <Textarea
          placeholder="more yapping? 🧐"
          className="w-full"
          disabled={isPending}
          radius="lg"
          defaultValue=""
          minRows={1}
          {...register("content")}
        />
        <div className="flex justify-start">
          <input
            type="file"
            hidden
            {...registerMedia}
            ref={(e) => {
              ref(e);

              mediaRef.current = e;
            }}
            accept="image/*, video/*"
          />

          {mediaUrl && (
            <div
              className={cn(
                "relative mt-2 w-full",
                mediaType === "image" && "aspect-square",
                isFileLoading && "animate-pulse",
              )}
            >
              <Button
                className="absolute right-2 top-2 z-50"
                isIconOnly
                radius="full"
                variant="light"
                title="Remove image"
                size="sm"
                onClick={onRemoveFile}
                type="button"
                disabled={isPending || isFileLoading}
              >
                <XIcon size={18} className="text-default-500" />
              </Button>
              {mediaType === "image" ? (
                <Image
                  src={mediaUrl}
                  alt="Comment's image"
                  fill
                  className="rounded-2xl object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <video
                  src={mediaUrl}
                  className="w-full rounded-2xl object-cover"
                  controls
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-start gap-2">
        {!mediaUrl && (
          <Button
            isIconOnly
            radius="full"
            variant="light"
            title="Add an image or video"
            size="sm"
            onClick={() => mediaRef.current?.click()}
            type="button"
            disabled={isPending}
          >
            <ImageIcon size={18} className="text-default-500" />
          </Button>
        )}

        <Button
          isLoading={isPending}
          disabled={isFileLoading}
          color="primary"
          size="sm"
          radius="lg"
          variant="flat"
          className="text-md font-bold"
          type="submit"
          isIconOnly
        >
          <SendIcon size={18} />
        </Button>
      </div>
    </form>
  );
};
