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

import { useChangeEmailForm } from "@/features/settings/hooks/use-change-email-form";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function ChangeEmailForm() {
  const {
    form,
    onSubmit,
    isPending,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
  } = useChangeEmailForm();

  const { isDirty, isValid } = form.formState;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
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
                  <FormControl className="w-full sm:w-fit">
                    <Input
                      disabled={isPending}
                      placeholder="david@aragundy.com"
                      {...field}
                    />
                  </FormControl>
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

        {isDirty && isValid && (
          <Button size="sm" disabled={isPending} type="submit">
            {isPending && <LoaderIcon className="animate-spin" />} Change email
          </Button>
        )}
      </form>
    </Form>
  );
}
