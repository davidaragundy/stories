import type { FullPost, CreatePostInputsServer } from "@/types";
import type { User } from "lucia";

type CreateOptimisticPost = CreatePostInputsServer & {
  user: User;
};

export const getOptimisticPost = ({
  user,
  content,
  media,
  onlyFollowers,
}: CreateOptimisticPost): FullPost => {
  const fakePostId = Math.random().toString(36).substring(2, 9);

  const createdAt = Date.now();

  return {
    id: fakePostId,
    createdAt,
    userId: user.id,
    content: content || "",
    fireCount: 0,
    poopCount: 0,
    capCount: 0,
    commentsCount: 0,
    onlyFollowers,
    user,
    media:
      media?.map((m) => ({
        ...m,
        postId: fakePostId,
        postCreatedAt: createdAt,
      })) || [],
    reactions: [],
    isPending: true,
  };
};
