import type { FullPost, CreatePostInputsServer } from "@/types";
import type { User } from "lucia";

type CreateOptimisticPost = CreatePostInputsServer & { user: User };

export const getOptimisticPost = ({
  user,
  content,
  media,
}: CreateOptimisticPost): FullPost => {
  const fakePostId = Math.random().toString(36).substring(2, 9);

  return {
    id: fakePostId,
    createdAt: Date.now(),
    userId: user.id,
    content: content || "",
    fireCount: 0,
    poopCount: 0,
    capCount: 0,
    user,
    media:
      media?.map((m) => ({
        ...m,
        postId: fakePostId,
      })) || [],
    reactions: [],
    isPending: true,
  };
};
