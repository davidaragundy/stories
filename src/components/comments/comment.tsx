"use client";

import { FullComment } from "@/types";
import { cn } from "@/utils";
import { Avatar } from "@nextui-org/react";
import { DateTime } from "luxon";
import Image from "next/image";
import { DeleteCommentButton } from "@/components";
import Link from "next/link";
import { usePageState } from "@/hooks";

//TODO: check comment width
export const Comment = ({ comment }: { comment: FullComment }) => {
  const { user } = usePageState();

  return (
    <div className={cn("flex w-full gap-3", comment.isPending && "opacity-50")}>
      <div>
        <Avatar
          src={comment.user.avatarUrl}
          alt={`${comment.user.firstName}'s profile picture`}
          isBordered
          className="mt-3"
        />
      </div>

      <div className="flex flex-1 items-start">
        <div
          className={cn(
            "flex flex-1 flex-col flex-wrap p-2",
            !comment.content && comment.media.length ? "gap-2" : "gap-1",
          )}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <Link href={`/${comment.user.username}`}>
                <h4 className="text-sm font-semibold hover:underline">
                  {comment.user.firstName} {comment.user.lastName}
                </h4>
              </Link>
              <span className="text-xs text-gray-400">
                {DateTime.fromMillis(comment.createdAt).toRelative({
                  locale: "en",
                })}
              </span>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2">
            {comment.content && (
              <p className="whitespace-break-spaces break-words text-justify text-sm">
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
                      className="w-full rounded-2xl object-cover"
                      fill
                      alt={`${comment.user.firstName}'s comment image`}
                      src={comment.media[0].url}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <video
                      key={media.id}
                      className="w-full rounded-2xl object-cover py-2"
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

        {comment.user.id === user!.id && (
          <DeleteCommentButton
            isCommentPending={!!comment.isPending}
            commentId={comment.id}
            postId={comment.postId}
          />
        )}
      </div>
    </div>
  );
};
