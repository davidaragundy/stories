"use client";

import Link from "next/link";

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

import { useCredentialsForm } from "@/features/auth/hooks";

import { Loader2, LockIcon, User2Icon } from "lucide-react";

export function CredentialsForm() {
  const { form, isLoading, onSubmit } = useCredentialsForm();

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormField
          control={form.control}
          name="username"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>

              <div className="relative">
                <FormControl>
                  <Input
                    className="peer ps-9 not-aria-invalid:border-none shadow-none aria-invalid:text-destructive-foreground"
                    disabled={isLoading}
                    placeholder={
                      fieldState.invalid ? undefined : "davidaragundy"
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
                  <User2Icon size={16} aria-hidden="true" />
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>
                Password
                <Link
                  prefetch
                  href="/forgot-password"
                  className="ml-auto text-xs text-foreground underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </FormLabel>

              <div className="relative">
                <FormControl>
                  <Input
                    className="peer ps-9 not-aria-invalid:border-none shadow-none aria-invalid:text-destructive-foreground"
                    disabled={isLoading}
                    type="password"
                    placeholder={fieldState.invalid ? undefined : "••••••••"}
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
                  <LockIcon size={16} aria-hidden="true" />
                </div>
              </div>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit">
          {isLoading && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
