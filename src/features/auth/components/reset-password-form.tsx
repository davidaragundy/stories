"use client";

import Link from "next/link";
import { LoaderIcon, LockIcon } from "lucide-react";

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
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { Input } from "@/shared/components/ui/input";
import { cn } from "@/shared/utils/cn";

import { useResetPasswordForm } from "@/features/auth/hooks/use-reset-password-form";
import { PasswordStrengthIndicator } from "@/shared/components/password-strength-indicator";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useResetPasswordForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>Reset password</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              You better remember it this time! 🫵
            </TypographyP>
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer ps-9 not-aria-invalid:border-none shadow-none aria-invalid:text-destructive-foreground"
                          disabled={isPending}
                          type="password"
                          placeholder={
                            fieldState.invalid ? undefined : "••••••••"
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
                        <LockIcon size={16} aria-hidden="true" />
                      </div>
                    </div>

                    <FormMessage />

                    {fieldState.isDirty && (
                      <PasswordStrengthIndicator password={field.value} />
                    )}
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>

                    <div className="relative">
                      <FormControl>
                        <Input
                          className="peer ps-9 not-aria-invalid:border-none shadow-none aria-invalid:text-destructive-foreground"
                          disabled={isPending}
                          type="password"
                          placeholder={
                            fieldState.invalid ? undefined : "••••••••"
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
                        <LockIcon size={16} aria-hidden="true" />
                      </div>
                    </div>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
                Reset password
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
