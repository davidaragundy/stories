"use client";

import { getCommentsAction } from "@/actions";
import { useQuery } from "@tanstack/react-query";
import { Comment, CommentError, CommentSkeleton } from "@/components";
import { User } from "lucia";

export const Comments = ({
  postId,
  user,
  queryKey,
}: {
  postId: string;
  user: User;
  queryKey: string;
}) => {
  const { data, isPending, isError, refetch } = useQuery({
    queryKey: ["comments", postId],
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
            <Comment
              key={comment.id}
              comment={comment}
              user={user}
              queryKey={queryKey}
            />
          ))}
        </div>
      )}
    </div>
  );
};
