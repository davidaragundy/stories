"use client";

import { Button } from "@/shared/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/components/ui/form";
import { H3 } from "@/shared/components/ui/h3";
import { Input } from "@/shared/components/ui/input";
import { Switch } from "@/shared/components/ui/switch";
import { Session } from "@/shared/lib/better-auth/client";

import { QRCodeDialog } from "@/features/settings/components/qr-code-dialog";
import { useAccountForm } from "@/features/settings/hooks/use-account-form";

interface Props {
  session: Session;
}

export function AccountForm({ session }: Props) {
  const {
    form,
    isLoading,
    totpURI,
    backupCodes,
    dialogTriggerRef,
    setBackupCodes,
    setTotpURI,
    onSubmit,
  } = useAccountForm(session);

  return (
    <>
      <QRCodeDialog
        URI={totpURI}
        setTotpURI={setTotpURI}
        isOpen={!!totpURI}
        backupCodes={backupCodes}
        setBackupCodes={setBackupCodes}
        dialogTriggerRef={dialogTriggerRef}
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
