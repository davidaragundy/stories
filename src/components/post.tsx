"use client";

import Image from "next/image";
import { Avatar } from "@nextui-org/avatar";
import { CapIcon, CommentIcon, FireIcon, PoopIcon } from "@/icons";
import {
  Comments,
  CreateComment,
  DeletePostButton,
  Reaction,
} from "@/components";
import type { FullPost } from "@/types";
import { useState } from "react";
import { DateTime } from "luxon";
import { Button } from "@nextui-org/button";
import { cn } from "@/utils";
import { User } from "lucia";
import Link from "next/link";

export const Post = ({
  post,
  user,
  queryKey,
}: {
  post: FullPost;
  user: User;
  queryKey: string;
}) => {
  const [showComments, setShowComments] = useState(false);

  const reactionsSet = new Set(
    post.reactions.map((r) => `${post.id}-${r.userId}-${r.type}`),
  );

  return (
    <div
      className={cn(
        "flex w-[clamp(10rem,60%,30rem)] flex-col gap-2",
        post.isPending && "opacity-50",
      )}
    >
      <div className="flex flex-col gap-4 rounded-[2rem] bg-default-100 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Avatar
              isBordered
              name={`${post.user.firstName} ${post.user.lastName}`}
              src={post.user.avatarUrl}
            />
            <div className="flex flex-col">
              <Link href={`/${post.user.username}`}>
                <h3 className="font-semibold hover:underline">
                  {post.user.firstName} {post.user.lastName}
                </h3>
              </Link>
              <span className="text-xs text-gray-400">
                {DateTime.fromMillis(post.createdAt).toRelative({
                  locale: "en",
                })}
              </span>
            </div>
          </div>
          {post.user.id === user.id && <DeletePostButton postId={post.id} />}
        </div>

        {post.content && (
          <p className="whitespace-break-spaces break-words rounded-large text-justify text-sm">
            {post.content}
          </p>
        )}

        {post.media.length > 0 && (
          <div
            className={cn(
              "relative w-full",
              post.media[0].type === "image" && "aspect-square",
            )}
          >
            {post.media.map((media) =>
              media.type === "image" ? (
                <Image
                  key={media.id}
                  className="w-full rounded-2xl object-cover"
                  fill
                  alt={`${post.user.firstName}'s post image`}
                  src={post.media[0].url}
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

      <div className="flex w-full items-center justify-center">
        <div className="flex items-center gap-3 rounded-[2rem] bg-default-100 px-2 py-1">
          <Reaction
            count={post.fireCount}
            reaction={"fire"}
            icon={<FireIcon size={16} />}
            color={"warning"}
            userId={user.id}
            target="post"
            targetId={post.id}
            reactionsSet={reactionsSet}
          />

          <Reaction
            count={post.poopCount}
            reaction={"poop"}
            icon={<PoopIcon size={14} />}
            color={"secondary"}
            userId={user.id}
            target="post"
            targetId={post.id}
            reactionsSet={reactionsSet}
          />

          <Reaction
            count={post.capCount}
            reaction={"cap"}
            icon={<CapIcon size={16} />}
            color={"primary"}
            userId={user.id}
            target="post"
            targetId={post.id}
            reactionsSet={reactionsSet}
          />

          <div className="flex items-center gap-1 text-default-500">
            <Button
              className="text-default-500"
              variant="light"
              isIconOnly
              radius="full"
              size="sm"
              onClick={() => setShowComments(!showComments)}
            >
              <CommentIcon size={16} />
            </Button>
            <span className="w-4">{post.commentsCount}</span>
          </div>
        </div>
      </div>

      {showComments && (
        <div className="flex flex-col gap-4 rounded-[2rem] bg-default-100 p-4">
          <Comments postId={post.id} user={user} queryKey={queryKey} />

          <CreateComment postId={post.id} user={user} queryKey={queryKey} />
        </div>
      )}
    </div>
  );
};
