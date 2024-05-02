"use client";

import { FullComment } from "@/types";
import { cn } from "@/utils";
import { Avatar } from "@nextui-org/react";
import { User } from "lucia";
import { DateTime } from "luxon";
import Image from "next/image";
import { DeleteCommentButton } from "@/components";

export const Comment = ({
  comment,
  user,
}: {
  comment: FullComment;
  user: User;
}) => {
  return (
    <div
      className={cn(
        "flex w-full gap-3 rounded-2xl border border-default-100 p-3",
        comment.isPending && "opacity-50",
      )}
    >
      <div>
        <Avatar
          src={comment.user.avatarUrl}
          alt={`${comment.user.firstName}'s profile picture`}
        />
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="-mb-4 flex w-full items-start justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold">
              {comment.user.firstName} {comment.user.lastName}
            </h4>
            <span className="text-xs text-gray-400">
              {DateTime.fromMillis(comment.createdAt).toRelative({
                locale: "en",
              })}
            </span>
          </div>

          {comment.user.id === user.id && (
            <DeleteCommentButton
              commentId={comment.id}
              postId={comment.postId}
            />
          )}
        </div>

        {comment.content && (
          <p className="whitespace-break-spaces break-words rounded-large text-justify text-sm">
            {comment.content}
          </p>
        )}

        {comment.media.length > 0 && (
          <div
            className={cn(
              "relative w-full",
              comment.media[0].type === "image" && "aspect-square",
            )}
          >
            {comment.media.map((media) =>
              media.type === "image" ? (
                <Image
                  key={media.id}
                  className="w-full rounded-lg object-cover"
                  fill
                  alt={`${comment.user.firstName}'s comment image`}
                  src={comment.media[0].url}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <video
                  key={media.id}
                  className="w-full rounded-lg object-cover py-2"
                  controls
                >
                  <source src={media.url} />
                </video>
              ),
            )}
          </div>
        )}
      </div>
    </div>
  );
};
