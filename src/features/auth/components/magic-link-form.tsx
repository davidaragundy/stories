"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
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
import { signInWithMagicLinkSchema } from "@/features/auth/schemas";
import { authClient } from "@/shared/lib/auth/client";
import { toast } from "sonner";

export function MagicLinkForm() {
  const form = useForm<z.infer<typeof signInWithMagicLinkSchema>>({
    resolver: zodResolver(signInWithMagicLinkSchema),
    defaultValues: {
      email: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (
    values: z.infer<typeof signInWithMagicLinkSchema>
  ) => {
    setIsLoading(true);

    const { data, error } = await authClient.signIn.magicLink({
      email: values.email,
      callbackURL: "/home",
    });

    if (error) {
      setIsLoading(false);

      switch (error.code) {
        case "USER_NOT_FOUND":
          form.setError("email", {
            message:
              "Please check your email address or sign up if you don't have an account.",
          });
          return;

        case "FAILED_TO_SEND_MAGIC_LINK":
          toast.error("Failed to send magic link 😢", {
            duration: 10000,
            description: "Try again later or use another method to sign in.",
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    }

    if (data.status) {
      toast.success("Magic link sent successfully 🎉", {
        description: "Check your inbox (or spam folder) for the link.",
        duration: 10000,
      });
    }

    setIsLoading(false);
  };

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
