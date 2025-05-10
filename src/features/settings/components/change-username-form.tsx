"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";

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
import { Skeleton } from "@/shared/components/ui/skeleton";

import { useChangeUsernameForm } from "@/features/settings/hooks/use-change-username-form";

export function ChangeUsernameForm() {
  const {
    form,
    onSubmit,
    isPending,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  } = useChangeUsernameForm();

  const { isDirty, isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          disabled={isPending}
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <div className="flex flex-wrap gap-2 items-center justify-start">
                <FormLabel>Username</FormLabel>

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
                  <FormControl className="w-full sm:w-fit">
                    <Input placeholder="davidaragundy" {...field} />
                  </FormControl>
                )}
              </div>

              <FormDescription className="text-sm text-muted-foreground">
                This is your public display username. It can be your real name
                or a pseudonym.
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        {isDirty && isValid && (
          <Button size="sm" disabled={isPending} type="submit">
            {isPending && <LoaderIcon className="animate-spin" />} Change
            username
          </Button>
        )}
      </form>
    </Form>
  );
}
