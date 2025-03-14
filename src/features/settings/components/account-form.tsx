"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Button,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  H3,
  Input,
  Switch,
} from "@/shared/components";
import { QRCodeDialog } from "@/features/settings/components";
import { accountFormSchema } from "@/features/settings/schemas";
import { authClient, Session } from "@/shared/lib/auth/client";
import { toast } from "sonner";

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface Props {
  session: Session;
}

export function AccountForm({ session }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [totpURI, setTotpURI] = useState<string>("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      enable2FA: !!session.user.twoFactorEnabled,
      password: "",
    },
  });

  async function onSubmit(values: AccountFormValues) {
    const toastId = toast.loading("Updating account...");
    setIsLoading(true);

    if (values.enable2FA) {
      const { data, error } = await authClient.twoFactor.enable({
        password: values.password,
      });

      setIsLoading(false);

      if (error) {
        switch (error.code) {
          case "INVALID_PASSWORD":
            form.setError("password", {
              message: "Invalid password",
            });
            toast.dismiss(toastId);
            return;

          default:
            toast.error("Failed to enable 2FA, please try again later 😢", {
              id: toastId,
              duration: 10000,
            });
            return;
        }
      }

      toast.dismiss(toastId);

      setTotpURI(data.totpURI);
      setBackupCodes(data.backupCodes);

      return;
    }

    if (!values.enable2FA) {
      const { error } = await authClient.twoFactor.disable({
        password: values.password,
      });

      setIsLoading(false);

      if (error) {
        switch (error.code) {
          case "INVALID_PASSWORD":
            form.setError("password", {
              message: "Invalid password",
            });
            toast.dismiss(toastId);
            return;

          default:
            toast.error("Failed to disable 2FA, please try again later 😢", {
              id: toastId,
              duration: 10000,
            });
            return;
        }
      }

      toast.success("2FA has been disabled successfully 🎉", {
        id: toastId,
        duration: 5000,
      });

      return;
    }
  }

  return (
    <>
      <QRCodeDialog
        URI={totpURI}
        setTotpURI={setTotpURI}
        isOpen={!!totpURI}
        backupCodes={backupCodes}
        setBackupCodes={setBackupCodes}
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <H3 className="mb-4 text-lg font-medium">Security</H3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="enable2FA"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel className="text-base">Enable 2FA</FormLabel>
                      <FormDescription>
                        Add an extra layer of security to your account.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start rounded-lg border p-4 gap-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Update account</FormLabel>
                  <FormDescription>
                    In order to update your account, please enter your password.
                  </FormDescription>
                </div>

                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />

                <Button disabled={isLoading} type="submit">
                  Update account
                </Button>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </>
  );
}
