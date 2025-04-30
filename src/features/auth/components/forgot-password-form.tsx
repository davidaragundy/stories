"use client";

import Link from "next/link";
import { Loader2, MailIcon } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { H1 } from "@/shared/components/ui/h1";
import { Input } from "@/shared/components/ui/input";
import { P } from "@/shared/components/ui/p";
import { cn } from "@/shared/utils/cn";

import { useForgotPasswordForm } from "@/features/auth/hooks/use-forgot-password-form";

export function ForgotPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isLoading } = useForgotPasswordForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <H1>Forgot password</H1>
          </CardTitle>

          <CardDescription>
            <P className="leading-normal">
              Have you ever thought about using a password manager? 😒
            </P>
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                            fieldState.invalid
                              ? undefined
                              : "david@aragundy.com"
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

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="animate-spin" />}
                Send reset link
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Do you remember now?{" "}
            <Link
              href="/sign-in"
              className="font-bold hover:underline hover:underline-offset-4"
            >
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
