"use client";

import Link from "next/link";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";

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
  FormMessage,
} from "@/shared/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";
import { cn } from "@/shared/utils/cn";

import { useTwoFactorForm } from "@/features/auth/hooks/use-two-factor-form";

export function TwoFactorForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, isLoading, onSubmit } = useTwoFactorForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">2FA 💂</CardTitle>
          <CardDescription>
            Enter your one-time password to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="flex w-full flex-col items-center">
                    <FormControl>
                      <InputOTP
                        pattern={REGEXP_ONLY_DIGITS}
                        maxLength={6}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot
                            className="size-[3em] text-lg"
                            index={0}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg"
                            index={1}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg"
                            index={2}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg"
                            index={3}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg"
                            index={4}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg"
                            index={5}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isLoading} type="submit" className="w-full">
                {isLoading && <Loader2 className="animate-spin" />}
                Verify
              </Button>
            </form>
          </Form>

          <div className="text-center text-sm">
            Don&apos;t have access to your authenticator app?{" "}
            <Link href="/recovery" className="underline underline-offset-4">
              Use recovery code
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
