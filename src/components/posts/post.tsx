"use client";

import Image from "next/image";
import { Avatar } from "@nextui-org/avatar";
import {
  CapIcon,
  CommentIcon,
  FireIcon,
  FollowingIcon,
  PoopIcon,
  WorldIcon,
} from "@/icons";
import {
  Comments,
  CreateComment,
  DeletePostButton,
  PostReaction,
} from "@/components";
import type { FullPost } from "@/types";
import { useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Button } from "@nextui-org/button";
import { cn } from "@/utils";
import Link from "next/link";
import { usePageState, usePostState } from "@/hooks";
import { Tooltip } from "@nextui-org/tooltip";

export const Post = ({ post }: { post: FullPost }) => {
  const { user, posts } = usePageState();
  const { dispatch } = usePostState();

  const [showComments, setShowComments] = useState(false);

  useEffect(() => {
    dispatch({
      type: "SET_REACTIONS_SET",
      payload: {
        reactionsSet: new Set(
          post.reactions.map((r) => `${r.userId}-${r.type}`),
        ),
      },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [post.reactions.length, dispatch]);

  useEffect(() => {
    dispatch({ type: "SET_ID", payload: { id: post.id } });
  }, [dispatch, post.id]);

  useEffect(() => {
    dispatch({
      type: "SET_IS_PENDING",
      payload: { isPending: !!post.isPending },
    });
  }, [dispatch, post.isPending]);

  return (
    <div
      className={cn(
        "flex flex-col gap-2",
        post.isPending && "opacity-50",
        posts?.queryKey.includes("profile")
          ? "w-[clamp(10rem,60%,30rem)]"
          : "w-[clamp(10rem,70%,30rem)]",
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

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {DateTime.fromMillis(post.createdAt).toRelative({
                    locale: "en",
                  })}
                </span>

                {post.onlyFollowers === "true" ? (
                  <Tooltip
                    content="Only your followers can see this post 🤙"
                    placement="right"
                  >
                    <FollowingIcon size={12} />
                  </Tooltip>
                ) : (
                  <Tooltip
                    content="Everyone can see this post 🌎"
                    placement="right"
                  >
                    <WorldIcon size={12} />
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {post.user.id === user!.id && <DeletePostButton />}
        </div>

        {post.content && (
          <p className="whitespace-break-spaces break-words text-justify text-sm">
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
          <PostReaction
            count={post.fireCount}
            reaction={"fire"}
            icon={<FireIcon size={16} />}
            color={"warning"}
          />

          <PostReaction
            count={post.poopCount}
            reaction={"poop"}
            icon={<PoopIcon size={14} />}
            color={"secondary"}
          />

          <PostReaction
            count={post.capCount}
            reaction={"cap"}
            icon={<CapIcon size={16} />}
            color={"primary"}
          />

          <div className="flex items-center gap-1 text-default-500">
            <Button
              disabled={post.isPending}
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
          <Comments />

          <CreateComment />
        </div>
      )}
    </div>
  );
};
