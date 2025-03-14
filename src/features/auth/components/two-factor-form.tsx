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
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components";
import { authClient } from "@/shared/lib/auth/client";
import { toast } from "sonner";
import { twoFactorSchema } from "@/shared/schemas";
import { useRouter } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";

export function TwoFactorForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof twoFactorSchema>) => {
    setIsLoading(true);

    const { error } = await authClient.twoFactor.verifyTotp({
      code: values.code,
    });

    if (error) {
      setIsLoading(false);

      switch (error.code) {
        case "INVALID_TWO_FACTOR_AUTHENTICATION":
          form.setError("code", {
            message: "Invalid one-time password",
          });
          return;

        default:
          toast.error("An error occurred, please try again later 😢");
          return;
      }
    }

    router.push("/home");

    setIsLoading(false);
  };

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
            {/*TODO: use recovery  */}
            <Link href="/sign-up" className="underline underline-offset-4">
              Use recovery code
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
