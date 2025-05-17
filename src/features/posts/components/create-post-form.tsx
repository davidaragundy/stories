"use client";

import { LoaderIcon, RotateCcwIcon, SendIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/ui/form";
import { Textarea } from "@/shared/components/ui/textarea";
import { cn } from "@/shared/utils/cn";

import { useCreatePostForm } from "@/features/posts/hooks/use-create-post-form";

export function CreatePostForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending, isError } = useCreatePostForm();

  return (
    <div className={cn("w-full", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    className="min-h-[100px] resize-none"
                    placeholder="What's on your mind?"
                    disabled={isPending}
                    {...field}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end">
            <Button
              type="submit"
              variant={isError ? "destructive" : "default"}
              disabled={isPending || !form.formState.isDirty}
              className="gap-2"
            >
              {isPending && <LoaderIcon className="animate-spin" />}
              {isError && <RotateCcwIcon />}
              {!isPending && !isError && <SendIcon />}
              Post
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
