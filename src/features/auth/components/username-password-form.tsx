"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { authClient } from "@/shared/lib/auth/client";
import { signInWithUsernameAndPasswordSchema } from "@/features/auth/schemas";
import { toast } from "sonner";

export function UsernamePasswordForm() {
  const form = useForm<z.infer<typeof signInWithUsernameAndPasswordSchema>>({
    resolver: zodResolver(signInWithUsernameAndPasswordSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (
    values: z.infer<typeof signInWithUsernameAndPasswordSchema>
  ) => {
    setIsLoading(true);

    const { error } = await authClient.signIn.username(
      {
        username: values.username,
        password: values.password,
      },
      {
        async onSuccess(context) {
          if (context.data.twoFactorRedirect) {
            return router.push("/2fa");
          }

          router.push("/home");
        },
      }
    );

    if (error) {
      setIsLoading(false);

      switch (error.code) {
        case "INVALID_USERNAME_OR_PASSWORD":
          form.setError("username", {
            message: "Invalid username or password.",
          });
          form.setError("password", {
            message: "Invalid username or password.",
          });
          return;

        case "EMAIL_NOT_VERIFIED":
          toast.error("Verify your email to sign in 📧", {
            description:
              "Check your inbox (or spam folder) for the verification email.",
            duration: 10000,
          });
          return;

        default:
          toast.error("Something went wrong, please try again later 😢");
          return;
      }
    }

    setIsLoading(false);
  };

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
