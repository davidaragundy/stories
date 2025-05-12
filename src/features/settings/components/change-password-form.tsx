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
import { PasswordStrengthIndicator } from "@/shared/components/password-strength-indicator";

import { useChangePasswordForm } from "@/features/settings/hooks/use-change-password-form";

export const ChangePasswordForm = () => {
  const { form, onSubmit, isPending, isError, isSessionSuccess } =
    useChangePasswordForm();

  const { errors, isDirty } = form.formState;

  const canSubmit = !errors.newPassword && isDirty;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <TypographyH4>Change password</TypographyH4>

        <FormField
          disabled={isPending || !isSessionSuccess}
          control={form.control}
          name="newPassword"
          render={({ field, fieldState }) => (
            <FormItem>
              <div className="flex flex-wrap gap-2 items-center justify-start">
                <FormLabel>New password</FormLabel>

                <FormControl className="w-full sm:w-fit">
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
              </div>

              <FormDescription className="text-sm text-muted-foreground">
                If you change your password, all your active sessions will be
                logged out.
              </FormDescription>

              {/* <FormMessage /> */}

              {(fieldState.isDirty || fieldState.isTouched) && (
                <PasswordStrengthIndicator password={field.value} />
              )}
            </FormItem>
          )}
        />

        {canSubmit && (
          <FormField
            disabled={isPending}
            control={form.control}
            name="currentPassword"
            render={({ field }) => (
              <FormItem className="bg-destructive/40 flex flex-col items-start rounded-lg p-4 gap-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Current password</FormLabel>

                  <FormDescription>
                    In order to change your password, please enter your current
                    password.
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
                  Change password
                </Button>
              </FormItem>
            )}
          />
        )}
      </form>
    </Form>
  );
};
