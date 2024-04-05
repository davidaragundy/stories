import Image from "next/image";
import { Avatar } from "@nextui-org/avatar";
import { CapIcon, CommentIcon, FireIcon, PoopIcon } from "@/icons";
import { DeletePostButton, PostReaction } from "@/components";
import type { Post as IPost, User } from "@/types";
import type { ComponentProps } from "react";
import { DateTime } from "luxon";
import { Button } from "@nextui-org/button";

export const Post = async ({
  post,
  user,
}: {
  post: IPost;
  user: Omit<User, "password">;
}) => {
  const reactions: ComponentProps<typeof PostReaction>[] = [
    {
      post: post,
      count: post.reactions.fire,
      reaction: "fire",
      icon: <FireIcon size={18} />,
      color: "warning",
    },
    {
      post: post,
      count: post.reactions.poop,
      reaction: "poop",
      icon: <PoopIcon size={18} />,
      color: "secondary",
    },
    {
      post: post,
      count: post.reactions.cap,
      reaction: "cap",
      icon: <CapIcon size={18} />,
      color: "primary",
    },
  ];

  return (
    <div className="flex w-[clamp(10rem,60%,30rem)] flex-col gap-2 p-5">
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Avatar
              isBordered
              name={`${user.firstName} ${user.lastName}`}
              src={user.avatarUrl}
            />
            <div>
              <h3 className="font-semibold">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-xs text-gray-400">
                {DateTime.fromMillis(post.createdAt).toRelative({
                  locale: "en",
                })}
              </p>
            </div>
          </div>
          <DeletePostButton postId={post.id} />
        </div>

        {post.content && (
          <p className="whitespace-break-spaces break-words rounded-large py-2 text-justify text-sm">
            {post.content}
          </p>
        )}

        {post.media.length > 0 && (
          <div className="relative aspect-square w-full">
            <Image
              className="w-full rounded-large object-cover"
              fill
              alt="Post image"
              src={post.media[0].url}
            />
          </div>
        )}
      </div>

      <div className="flex w-full items-center justify-center">
        <div className="flex items-center gap-5">
          {reactions.map((reaction, index) => (
            <PostReaction key={`${Date.now()}-${index}`} {...reaction} />
          ))}

          <div className="flex items-center gap-1 text-default-500">
            <Button
              className="text-default-500"
              variant="light"
              isIconOnly
              radius="full"
              size="sm"
            >
              <CommentIcon size={18} />
            </Button>
            <span>{0}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
