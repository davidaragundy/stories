"use client";

import { createPostAction } from "@/actions";
import { ImageIcon, XIcon } from "@/icons";
import { ActionResponse } from "@/types";
import { Avatar } from "@nextui-org/avatar";
import { Button } from "@nextui-org/button";
import { Textarea } from "@nextui-org/input";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useFormState } from "react-dom";
import toast from "react-hot-toast";
import { CreatePostButton, Toast } from "@/components";
import { User } from "lucia";
import { cn } from "@/utils";

export const CreatePost = ({ user }: { user: User }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [mediaUrl, setMediaUrl] = useState<string>("");
  const [mediaType, setMediaType] = useState<"image" | "video">();

  const mediaRef = useRef<HTMLInputElement>(null);
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const [actionResponse, formAction] = useFormState(
    createPostAction,
    {} as ActionResponse,
  );

  useEffect(() => {
    if (Object.keys(actionResponse).length > 0) {
      toast.custom(
        (props) => (
          <Toast
            {...props}
            message={actionResponse.messages.toString()}
            variant={actionResponse.ok ? "default" : "danger"}
          />
        ),
        {
          duration: 3000,
        },
      );

      if (!actionResponse.ok) return;

      URL.revokeObjectURL(mediaUrl);

      formRef.current?.reset();
      setMediaUrl("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actionResponse]);

  return (
    <form
      className="flex w-[clamp(10rem,60%,30rem)] flex-col gap-5 rounded-3xl p-5"
      action={formAction}
      ref={formRef}
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
        <CreatePostButton
          setLoading={setLoading}
          formRef={formRef}
          contentRef={contentRef}
          mediaRef={mediaRef}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Textarea
          placeholder="just start yapping about anything 💩"
          className="w-full"
          disabled={loading}
          radius="lg"
          name="content"
          defaultValue=""
          minRows={1}
          ref={contentRef}
        />

        <div className="flex justify-start">
          <input
            type="file"
            className="hidden"
            name="media"
            ref={mediaRef}
            onChange={({ currentTarget }) => {
              if (currentTarget.files?.[0]) {
                if (currentTarget.files[0].size > 6 * 2 ** 20) {
                  toast.custom(
                    (props) => (
                      <Toast
                        {...props}
                        message="The file is too large. Max size is 6MiB. 😠"
                        variant="danger"
                      />
                    ),
                    { duration: 3000 },
                  );

                  return;
                }

                const url = URL.createObjectURL(currentTarget.files[0]);

                setMediaUrl(url);
                setMediaType(
                  currentTarget.files[0].type.includes("image")
                    ? "image"
                    : "video",
                );
              }
            }}
            accept="image/*, video/*"
          />

          {!mediaUrl && (
            <Button
              isIconOnly
              radius="full"
              variant="light"
              title="Add an image"
              size="sm"
              onClick={() => mediaRef.current?.click()}
              type="button"
              disabled={loading}
            >
              <ImageIcon size={18} className="text-default-500" />
            </Button>
          )}

          {mediaUrl && (
            <div
              className={cn(
                "relative mt-2 w-full",
                mediaType === "image" && "aspect-square",
              )}
            >
              <Button
                className="absolute right-2 top-2 z-50"
                isIconOnly
                radius="full"
                variant="light"
                title="Remove image"
                size="sm"
                onClick={() => {
                  URL.revokeObjectURL(mediaUrl);
                  setMediaUrl("");

                  mediaRef.current!.value = "";
                  mediaRef.current!.files = null;
                }}
                type="button"
                disabled={loading}
              >
                <XIcon size={18} className="text-default-500" />
              </Button>
              {mediaType === "image" ? (
                <Image
                  src={mediaUrl}
                  alt="Post's image"
                  fill
                  className="rounded-2xl object-cover"
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
