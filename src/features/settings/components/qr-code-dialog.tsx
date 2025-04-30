"use client";

import { Dispatch, SetStateAction } from "react";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { Loader2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { Button } from "@/shared/components/ui/button";
import { Code } from "@/shared/components/ui/code";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/shared/components/ui/input-otp";

import { useQrCodeDialog } from "@/features/settings/hooks/use-qr-code-dialog";

interface Props {
  URI: string;
  setTotpURI: Dispatch<SetStateAction<string>>;
  backupCodes: string[];
  setBackupCodes: Dispatch<SetStateAction<string[]>>;
  isOpen?: boolean;
  dialogTriggerRef: React.RefObject<HTMLButtonElement | null>;
}

export const QRCodeDialog = ({
  URI,
  setTotpURI,
  dialogTriggerRef,
  backupCodes,
  setBackupCodes,
}: Props) => {
  const {
    form,
    isLoading,
    key,
    onSubmit,
    showBackupCodes,
    handleDownloadBackupCodes,
  } = useQrCodeDialog({
    URI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
  });

  return (
    <Dialog modal>
      <DialogTrigger hidden ref={dialogTriggerRef} />
      <DialogContent
        showCloseBtn={showBackupCodes}
        onEscapeKeyDown={(event) => event.preventDefault()}
        onInteractOutside={(event) => event.preventDefault()}
        className="flex flex-col items-center gap-8"
      >
        <DialogHeader>
          <DialogTitle>
            {showBackupCodes
              ? "Download backup codes"
              : "Scan the QR in your authenticator app"}
          </DialogTitle>
          <DialogDescription className="flex flex-col gap-2">
            {showBackupCodes ? (
              "Please download your backup codes and keep them in a safe place."
            ) : (
              <>
                Or enter your secret key manually: <Code>{key}</Code>
              </>
            )}
          </DialogDescription>
        </DialogHeader>

        {URI && !showBackupCodes && (
          <QRCodeSVG
            size={256}
            bgColor="#0b0809"
            fgColor="#ffffff"
            value={URI}
          />
        )}

        {showBackupCodes ? (
          <Button onClick={handleDownloadBackupCodes}>
            Download backup codes
          </Button>
        ) : (
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
        )}
      </DialogContent>
    </Dialog>
  );
};
