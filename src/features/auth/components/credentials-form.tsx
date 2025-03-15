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

import { useCredentialsForm } from "@/features/auth/hooks";

import { Loader2 } from "lucide-react";

export function CredentialsForm() {
  const { form, isLoading, onSubmit } = useCredentialsForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  placeholder="davidaragundy"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Password
                <Link
                  href="/forgot-password"
                  className="ml-auto text-xs underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </Link>
              </FormLabel>
              <FormControl>
                <Input
                  disabled={isLoading}
                  type="password"
                  placeholder="••••••••"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && <Loader2 className="animate-spin" />}
          Sign in
        </Button>
      </form>
    </Form>
  );
}
