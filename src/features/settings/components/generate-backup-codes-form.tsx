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
import { TypographyH4 } from "@/shared/components/ui/typography";

import { useGenerateBackupCodesForm } from "@/features/settings/hooks/use-generate-backup-codes-form";

export const GenerateBackupCodesForm = () => {
  const { form, onSubmit, isPending, isError, isTwoFactorEnabled } =
    useGenerateBackupCodesForm();

  return (
    isTwoFactorEnabled && (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <TypographyH4>Backup codes</TypographyH4>

          <div className="space-y-4">
            <FormField
              control={form.control}
              name="generateBackupCodes"
              render={({ field }) => (
                <FormItem>
                  <div className="flex flex-wrap gap-4 items-center justify-start">
                    <FormLabel>Generate backup codes</FormLabel>

                    <FormControl>
                      <Button
                        disabled={isPending}
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => field.onChange(true)}
                      >
                        Generate
                      </Button>
                    </FormControl>
                  </div>

                  <FormDescription>
                    Generate a set of backup codes to use if you lose your
                    authenticator app. If you already have backup codes, this
                    will generate a new set and invalidate the old.
                  </FormDescription>
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
                      In order to generate backup codes, please enter your
                      password.
                    </FormDescription>
                  </div>

                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />

                  <Button
                    disabled={isPending}
                    type="submit"
                    variant={isError ? "destructive" : "default"}
                  >
                    {isPending && <LoaderIcon className="animate-spin" />}
                    {isError && <RotateCcwIcon />}
                    Generate backup codes
                  </Button>
                </FormItem>
              )}
            />
          )}
        </form>
      </Form>
    )
  );
};
