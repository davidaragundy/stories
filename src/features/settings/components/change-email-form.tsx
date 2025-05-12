"use client";

import { CheckIcon, LoaderIcon, RotateCcwIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";

import { useChangeEmailForm } from "@/features/settings/hooks/use-change-email-form";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ChangeEmailForm() {
  const {
    form,
    canSubmit,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  } = useChangeEmailForm();

  return (
    <Form {...form}>
      <form
        onKeyDown={(event) => {
          if (event.key === "Enter" && !canSubmit) event.preventDefault();
        }}
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          disabled={isPending}
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-wrap gap-2 items-center justify-start">
                <FormLabel>Email</FormLabel>

                {isSessionLoading && <Skeleton className="w-[200px] h-8" />}

                {isSessionError && (
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => refetchSession()}
                  >
                    Retry{" "}
                    {isSessionRefetching ? (
                      <LoaderIcon className="animate-spin" />
                    ) : (
                      <RotateCcwIcon />
                    )}
                  </Button>
                )}

                {isSessionSuccess && (
                  <FormControl className="flex-1 sm:flex-none sm:w-fit">
                    <Input placeholder="david@aragundy.com" {...field} />
                  </FormControl>
                )}

                {canSubmit && (
                  <Button
                    variant={isError ? "destructive" : "ghost"}
                    className="rounded-full"
                    size="icon"
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {isError && <RotateCcwIcon />}
                    {!isPending && !isError && <CheckIcon />}
                  </Button>
                )}
              </div>

              <FormDescription className="text-sm text-muted-foreground">
                This is the email address we will use to contact you. It will
                not be publicly visible.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
