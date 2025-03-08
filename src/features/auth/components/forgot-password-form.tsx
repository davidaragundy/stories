"use client";

import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
} from "@/shared/components";
import { forgotPasswordSchema } from "@/features/auth/schemas";
import { authClient } from "@/shared/lib/auth/client";
import { toast } from "sonner";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof forgotPasswordSchema>) => {
    setIsLoading(true);

    const { error } = await authClient.forgetPassword({
      email: values.email,
      redirectTo: "/reset-password",
    });

    setIsLoading(false);

    if (error) {
      switch (error.code) {
        case "FAILED_TO_SEND_RESET_PASSWORD_EMAIL":
          const toastId = toast.error(
            "Failed to send reset password email. 😢",
            {
              duration: 10000,
              action: {
                label: "Resend email",
                onClick: async () => {
                  const id = toast.loading("Resending email...");

                  const { error } = await authClient.forgetPassword({
                    email: values.email,
                    redirectTo: "/reset-password",
                  });

                  if (error) {
                    toast.dismiss(id);
                    toast.error("Failed to resend email. 😢", {
                      id: toastId,
                      duration: 10000,
                    });
                    return;
                  }

                  toast.success("Email sent successfully! 🎉", {
                    description: "Don't forget to check your spam folder.",
                    id,
                  });
                },
              },
            }
          );
          return;

        default:
          toast.error("Something went wrong. Please try again later. 😢");
          return;
      }
    }

    toast.success("Reset link sent successfully! 🎉", {
      description: "Don't forget to check your spam folder.",
    });
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Forgot your password? 😒</CardTitle>
          <CardDescription>
            Have you ever thought about using a password manager?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
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
                        disabled={isLoading}
                        type="email"
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
                Send reset link
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Do you remember now?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
