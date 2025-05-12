"use client";

import { LoaderIcon, MailIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useMagicLinkForm } from "@/features/auth/hooks/use-magic-link-form";

export function MagicLinkForm() {
  const { form, onSubmit, isPending } = useMagicLinkForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>

              <div className="relative">
                <FormControl>
                  <Input
                    className="peer ps-9 not-aria-invalid:border-none shadow-none aria-invalid:text-destructive-foreground"
                    type="email"
                    disabled={isPending}
                    placeholder={
                      fieldState.invalid ? undefined : "david@aragundy.com"
                    }
                    {...field}
                  />
                </FormControl>

                <div
                  className={cn(
                    "text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50",
                    fieldState.invalid && "text-destructive-foreground",
                    fieldState.isDirty &&
                      !fieldState.invalid &&
                      "text-foreground"
                  )}
                >
                  <MailIcon size={16} aria-hidden="true" />
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isPending} type="submit">
          {isPending && <LoaderIcon className="animate-spin" />}
          Send Magic Link
        </Button>
      </form>
    </Form>
  );
}
