"use client";

import { getCommentsAction } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { Comment, CommentsError, CommentsSkeleton } from "@/components";
import { usePostState } from "@/hooks";

export const Comments = () => {
  const { id: postId } = usePostState();

  const { data, isPending, isError } = useQuery({
    queryKey: ["post", postId, "comments"],
    queryFn: async () => await getCommentsAction(postId),
  });

  return (
    <div className="flex w-full flex-col gap-3">
      <h4 className="font-bold">
        Comments ({isPending ? "🫣" : data?.length || 0})
      </h4>

      {isPending && <CommentsSkeleton />}

      {isError && <CommentsError />}

      {data && (
        <div className="flex w-full flex-col gap-5">
          {data.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};
