"use client";

import { LoaderIcon, RotateCcwIcon } from "lucide-react";

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
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { Switch } from "@/shared/components/ui/switch";
import { TypographyH4 } from "@/shared/components/ui/typography";

import { QRCodeDialog } from "@/features/settings/components/qr-code-dialog";
import { useToggle2FAForm } from "@/features/settings/hooks/use-toggle-2fa-form";

export const Toggle2FAForm = () => {
  const {
    form,
    onSubmit,
    isPending,
    isError,
    isSessionSuccess,
    isSessionLoading,
    isSessionError,
    refetchSession,
    isSessionRefetching,
    totpURI,
    setTotpURI,
    backupCodes,
    setBackupCodes,
    dialogTriggerRef,
  } = useToggle2FAForm();

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
          <TypographyH4>Two-factor authentication</TypographyH4>

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

                  {isSessionLoading && (
                    <Skeleton className="h-5 w-10 rounded-full" />
                  )}

                  {isSessionError && (
                    <Button
                      variant="outline"
                      type="button"
                      onClick={() => refetchSession()}
                    >
                      Retry{" "}
                      {isSessionRefetching ? (
                        <LoaderIcon className="animate-spin" />
                      ) : (
                        <RotateCcwIcon />
                      )}
                    </Button>
                  )}

                  {isSessionSuccess && (
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  )}
                </FormItem>
              )}
            />
          </div>

          {form.formState.isDirty && (
            <FormField
              disabled={isPending}
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem className="bg-destructive/40 flex flex-col items-start rounded-lg p-4 gap-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Password</FormLabel>

                    <FormDescription>
                      In order to{" "}
                      {form.getValues("enable2FA") ? "enable" : "disable"} 2FA,
                      please enter your password.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />

                  <Button
                    variant={isError ? "destructive" : "default"}
                    disabled={isPending}
                    type="submit"
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {isError && <RotateCcwIcon />}
                    {form.getValues("enable2FA") ? "Enable" : "Disable"} 2FA
                  </Button>
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    </>
  );
};
