"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { signInSchema } from "@/features/auth/schemas";
import { authClient } from "@/shared/lib/auth/client";
import { toast } from "sonner";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof signInSchema>) => {
    setIsLoading(true);

    const { data, error } = await authClient.signIn.email({
      email: values.email,
      password: values.password,
      callbackURL: "/home",
    });

    if (error) {
      setIsLoading(false);

      switch (error.code) {
        case "INVALID_EMAIL_OR_PASSWORD":
          form.setError("email", {
            message: "Invalid email or password.",
          });
          form.setError("password", {
            message: "Invalid email or password.",
          });
          return;

        case "EMAIL_NOT_VERIFIED":
          toast.error("Verify your email to sign in. 📧", {
            description:
              "Check your inbox (or spam folder) for the verification email.",
            duration: 10000,
          });
          return;

        case "FAILED_TO_SEND_VERIFICATION_EMAIL":
          const toastId = toast.error("Failed to send verification email. 😢", {
            duration: 10000,
            action: {
              label: "Resend email",
              onClick: async () => {
                const id = toast.loading("Resending email...");

                const { error } = await authClient.sendVerificationEmail({
                  email: values.email,
                  callbackURL: "/home",
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
          });
          return;

        default:
          toast.error("Something went wrong. Please try again later. 😢");
          return;
      }
    }

    if (data.redirect) {
      router.push(data.url as string);
    }

    setIsLoading(false);
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back 🧍</CardTitle>
          <CardDescription>Sign in with your GitHub account</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={isLoading}
              onClick={async () => {
                setIsLoading(true);

                const { data, error } = await authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/home",
                });

                if (error) {
                  toast.error("Failed to sign in with GitHub.");
                }

                if (data?.redirect) router.push(data.url as string);

                setIsLoading(false);
              }}
            >
              <svg
                role="img"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
              >
                <title>GitHub</title>
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
              </svg>
              Sign in with GitHub
            </Button>
          </div>

          <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
            <span className="bg-background text-muted-foreground relative z-10 px-2">
              Or continue with
            </span>
          </div>

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

          <div className="text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="underline underline-offset-4">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
