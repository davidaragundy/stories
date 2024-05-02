import type { FullComment, CreateCommentInputsServer } from "@/types";
import type { User } from "lucia";

type CreateOptimisticComment = CreateCommentInputsServer & { user: User };

export const getOptimisticComment = ({
  user,
  content,
  media,
  postId,
  parentId,
}: CreateOptimisticComment): FullComment => {
  const fakeCommentId = Math.random().toString(36).substring(2, 9);

  return {
    id: fakeCommentId,
    createdAt: Date.now(),
    userId: user.id,
    postId,
    parentId,
    content: content || "",
    fireCount: 0,
    poopCount: 0,
    capCount: 0,
    repliesCount: 0,
    user,
    media:
      media?.map((m) => ({
        ...m,
        commentId: fakeCommentId,
      })) || [],
    reactions: [],
    isPending: true,
  };
};
