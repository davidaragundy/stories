import { useMutation, useQueryClient } from "@tanstack/react-query";
import { nanoid } from "nanoid";
import { toast } from "sonner";

import { createPost } from "@/features/posts/actions/create-post";
import { post } from "@/shared/lib/drizzle/schema";
import { useSession } from "@/shared/hooks/use-session";

type Post = typeof post.$inferSelect;

export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  return useMutation({
    mutationFn: async (content: string) => {
      const { error } = await createPost(content);

      if (error) throw new Error(error.message);
    },
    onMutate: async (content) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);

      // Create an optimistic post
      const optimisticPost: Post = {
        id: nanoid(),
        userId: session?.user.id ?? "",
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Optimistically update to the new value
      queryClient.setQueryData<Post[]>(["posts"], (old) => {
        return [optimisticPost, ...(old ?? [])];
      });

      // Return a context object with the snapshotted value
      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["posts"], context?.previousPosts);

      toast.error("Failed to create post");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we're in sync with the server
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
