"use client";

import Link from "next/link";

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
  FormMessage,
  Input,
} from "@/shared/components";
import { cn } from "@/shared/utils";

import { useRecoveryForm } from "@/features/auth/hooks";

import { Loader2 } from "lucide-react";

export function RecoveryForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { form, isLoading, onSubmit } = useRecoveryForm();

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none bg-background shadow-none">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Recovery code 🔐</CardTitle>
          <CardDescription>
            Enter the code from your recovery code list. Remember that each code
            can only be used once.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="abcde-fghij"
                        {...field}
                      />
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
            Remember your credentials?{" "}
            <Link href="/sign-in" className="underline underline-offset-4">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
