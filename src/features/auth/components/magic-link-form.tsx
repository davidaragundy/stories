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

import { useMagicLinkForm } from "@/features/auth/hooks";

import { Loader2 } from "lucide-react";

export function MagicLinkForm() {
  const { form, onSubmit, isLoading } = useMagicLinkForm();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  disabled={isLoading}
                  placeholder="david@aragundy.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading && <Loader2 className="animate-spin" />}
          Send Magic Link
        </Button>
      </form>
    </Form>
  );
}
