"use client";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components";
import { authClient } from "@/shared/lib/auth/client";
import { twoFactorSchema } from "@/shared/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface Props {
  URI: string;
  setTotpURI: Dispatch<SetStateAction<string>>;
  backupCodes: string[];
  setBackupCodes: Dispatch<SetStateAction<string[]>>;
  isOpen?: boolean;
}

export const QRCodeDialog = ({
  URI,
  setTotpURI,
  isOpen,
  backupCodes,
  setBackupCodes,
}: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof twoFactorSchema>>({
    resolver: zodResolver(twoFactorSchema),
    defaultValues: {
      code: "",
    },
  });

  async function onSubmit(values: z.infer<typeof twoFactorSchema>) {
    setIsLoading(true);

    const { error } = await authClient.twoFactor.verifyTotp({
      code: values.code,
    });

    setIsLoading(false);

    if (error) {
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

    toast.success("Two-factor authentication enabled successfully 🎉");
    setTotpURI("");
    setBackupCodes([]);
  }

  return (
    <Dialog open={isOpen} modal>
      <DialogContent
        showCloseBtn={false}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="flex flex-col items-center gap-8"
      >
        <DialogHeader>
          <DialogTitle>Scan the QR in your authenticator app</DialogTitle>
          <DialogDescription>
            Your recovery keys: {backupCodes.join(", ")}
          </DialogDescription>
        </DialogHeader>

        <QRCodeSVG size={256} bgColor="#0b0809" fgColor="#ffffff" value={URI} />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>One-Time Password</FormLabel>
                  <FormDescription>
                    Please enter the one-time password from your authenticator
                    app.
                  </FormDescription>
                  <FormControl>
                    <div className="flex gap-4 items-center">
                      <InputOTP
                        pattern={REGEXP_ONLY_DIGITS}
                        maxLength={6}
                        {...field}
                      >
                        <InputOTPGroup>
                          <InputOTPSlot index={0} />
                          <InputOTPSlot index={1} />
                          <InputOTPSlot index={2} />
                          <InputOTPSlot index={3} />
                          <InputOTPSlot index={4} />
                          <InputOTPSlot index={5} />
                        </InputOTPGroup>
                      </InputOTP>

                      <Button disabled={isLoading} type="submit">
                        {isLoading && <Loader2 className="animate-spin" />}
                        Verify
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
