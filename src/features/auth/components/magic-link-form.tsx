"use client";

import {
  Button,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/components";
import { cn } from "@/shared/utils";

import { useMagicLinkForm } from "@/features/auth/hooks";

import { Loader2, MailIcon } from "lucide-react";

export function MagicLinkForm() {
  const { form, onSubmit, isLoading } = useMagicLinkForm();

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
                    disabled={isLoading}
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

        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader2 className="animate-spin" />}
          Send Magic Link
        </Button>
      </form>
    </Form>
  );
}
