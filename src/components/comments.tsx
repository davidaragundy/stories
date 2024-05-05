"use client";

import { getCommentsAction } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { Comment, CommentError, CommentSkeleton } from "@/components";
import { usePostStore } from "@/hooks";

export const Comments = () => {
  const { id: postId } = usePostStore((state) => state);

  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["post", postId, "comments"],
    queryFn: async () => await getCommentsAction(postId),
  });

  return (
    <div className="flex flex-col gap-3">
      <h4 className="font-bold">
        Comments ({isPending ? "🫣" : data?.length || 0})
      </h4>

      {isPending && <CommentSkeleton />}

      {isError && <CommentError refetch={refetch} />}

      {data && (
        <div className="flex flex-col gap-3">
          {data.map((comment) => (
            <Comment key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  );
};
