"use client";

import Link from "next/link";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { LoaderIcon } from "lucide-react";

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
import { TypographyH1, TypographyP } from "@/shared/components/ui/typography";
import { cn } from "@/shared/utils/cn";

import { useTwoFactorForm } from "@/features/auth/hooks/use-two-factor-form";

export function TwoFactorForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, onSubmit, isPending } = useTwoFactorForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle>
            <TypographyH1>2FA 💂</TypographyH1>
          </CardTitle>

          <CardDescription>
            <TypographyP className="leading-normal">
              Enter your one-time password to continue.
            </TypographyP>
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
                        onComplete={form.handleSubmit(onSubmit)}
                        {...field}
                      >
                        <InputOTPGroup className="gap-2">
                          <InputOTPSlot
                            className="size-[3em] text-lg !rounded-lg"
                            index={0}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg !rounded-lg"
                            index={1}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg !rounded-lg"
                            index={2}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg !rounded-lg"
                            index={3}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg !rounded-lg"
                            index={4}
                          />
                          <InputOTPSlot
                            className="size-[3em] text-lg !rounded-lg"
                            index={5}
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={isPending} type="submit" className="w-full">
                {isPending && <LoaderIcon className="animate-spin" />}
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
