import Image from "next/image";
import { Avatar } from "@nextui-org/avatar";
import { CapIcon, CommentIcon, FireIcon, PoopIcon } from "@/icons";
import { DeletePostButton, PostReaction } from "@/components";
import type { Post as IPost, PostMedia, User } from "@/types";
import { type ComponentProps } from "react";
import { DateTime } from "luxon";
import { Button } from "@nextui-org/button";
import { cn } from "@/utils";

interface Props extends IPost {
  user: Omit<User, "password" | "createdAt">;
  media: PostMedia[];
  reactions: { userId: string; type: string }[];
}

export const Post = async ({ post }: { post: Props }) => {
  const reactionsSet = new Set(
    post.reactions.map((r) => `${r.userId}-${r.type}`),
  );

  const reactions: ComponentProps<typeof PostReaction>[] = [
    {
      userId: post.user.id,
      postId: post.id,
      count: post.fireCount,
      reaction: "fire",
      icon: <FireIcon size={18} />,
      color: "warning",
      reactionsSet: reactionsSet,
    },
    {
      userId: post.user.id,
      postId: post.id,
      count: post.poopCount,
      reaction: "poop",
      icon: <PoopIcon size={18} />,
      color: "secondary",
      reactionsSet: reactionsSet,
    },
    {
      userId: post.user.id,
      postId: post.id,
      count: post.capCount,
      reaction: "cap",
      icon: <CapIcon size={18} />,
      color: "primary",
      reactionsSet: reactionsSet,
    },
  ];

  return (
    <div className="flex w-[clamp(10rem,60%,30rem)] flex-col gap-2 p-5">
      <div className="flex w-full flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Avatar
              isBordered
              name={`${post.user.firstName} ${post.user.lastName}`}
              src={post.user.avatarUrl}
            />
            <div>
              <h3 className="font-semibold">
                {post.user.firstName} {post.user.lastName}
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
          <div
            className={cn(
              "relative w-full",
              post.media[0].type === "image" && "my-2 aspect-square",
            )}
          >
            {post.media.map((media) =>
              media.type === "image" ? (
                <Image
                  key={media.id}
                  className="w-full rounded-3xl object-cover"
                  fill
                  alt={`${post.user.firstName}'s post image`}
                  src={post.media[0].url}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <video
                  key={media.id}
                  className="w-full rounded-3xl object-cover py-2"
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
