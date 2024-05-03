"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ImageIcon, SendIcon, XIcon } from "@/icons";
import { CreatePostInputsClient, UploadedFilesResponse } from "@/types";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import toast from "react-hot-toast";
import { Toast } from "@/components";
import { User } from "lucia";
import { cn, removeFiles, removeUnpostedFiles, uploadFiles } from "@/utils";
import { SubmitHandler, useForm } from "react-hook-form";
import { createPostSchemaClient } from "@/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreatePostMutation } from "@/hooks";
import { postsRef } from "@/lib/firebase";

export const CreatePost = ({
  user,
  queryKey,
}: {
  user: User;
  queryKey: string;
}) => {
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video">();
  const [isFileLoading, setIsFileLoading] = useState<boolean>(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFilesResponse[]>(
    [],
  );

  const mediaRef = useRef<HTMLInputElement | null>(null);

  const { mutateAsync, isPending } = useCreatePostMutation({
    user,
    queryKey,
  });

  const { register, handleSubmit, getValues, reset, watch } =
    useForm<CreatePostInputsClient>({
      resolver: zodResolver(createPostSchemaClient),
      defaultValues: {
        userId: user.id,
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

        setMediaUrl(url);
        setMediaType(media[0].type.includes("image") ? "image" : "video");
        setIsFileLoading(true);

        const uploadedFiles = await uploadFiles(postsRef, media);

        setUploadedFiles(uploadedFiles);

        sessionStorage.setItem(
          "uploadedFiles",
          JSON.stringify(uploadedFiles.map((file) => file.id)),
        );

        URL.revokeObjectURL(url);
        url = uploadedFiles[0].url;

        setMediaUrl(url);
        setIsFileLoading(false);
      }
    })();

    window.onbeforeunload = () => removeUnpostedFiles(postsRef);

    return () => {
      window.onbeforeunload = null;

      removeUnpostedFiles(postsRef);
    };
  }, [media]);

  //TODO: file or files? decide 🫵
  const onRemoveFile = async () => {
    setIsFileLoading(true);

    try {
      await removeFiles(
        postsRef,
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

    setMediaUrl("");
    setMediaType(undefined);
    setUploadedFiles([]);

    setIsFileLoading(false);

    mediaRef.current!.value = "";
    mediaRef.current!.files = null;
  };

  const onSubmit: SubmitHandler<CreatePostInputsClient> = async (data) => {
    if (!getValues("content") && !uploadedFiles.length) {
      return;
    }

    const dataToSubmit = {
      ...data,
      media: uploadedFiles,
    };

    const { ok, messages } = await mutateAsync(dataToSubmit);

    if (!ok) {
      return toast.custom(
        (props) => (
          <Toast {...props} message={messages.toString()} variant={"danger"} />
        ),
        { duration: 3000 },
      );
    }

    reset();
    setMediaUrl("");
    setMediaType(undefined);
    setUploadedFiles([]);
    sessionStorage.removeItem("uploadedFiles");
  };

  return (
    <form
      className="flex w-[clamp(10rem,60%,30rem)] flex-col gap-4 rounded-[2rem] bg-default-100 p-4"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Avatar
            isBordered
            name={`${user.firstName} ${user.lastName}`}
            src={user.avatarUrl}
          />
          <div>
            <h3 className="font-semibold">{`${user.firstName} ${user.lastName}`}</h3>
          </div>
        </div>

        <div className="flex gap-2">
          {!mediaUrl && (
            <Button
              isIconOnly
              radius="full"
              variant="light"
              title="Add an image"
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
      </div>

      <div className="flex flex-col gap-1">
        <Textarea
          placeholder="just start yapping about anything 💩"
          className="w-full"
          disabled={isPending}
          radius="lg"
          defaultValue=""
          minRows={1}
          // variant="bordered"
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
                  alt="Post's image"
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
    </form>
  );
};
