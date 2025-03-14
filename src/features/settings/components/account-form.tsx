"use client";

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
import { accountFormSchema } from "@/features/settings/schemas";
import { authClient } from "@/shared/lib/auth/client";

type AccountFormValues = z.infer<typeof accountFormSchema>;

//TODO: This should come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  enable2FA: false,
  password: "",
};

export function AccountForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  async function onSubmit(values: AccountFormValues) {
    if (values.enable2FA) {
      const { data } = await authClient.twoFactor.enable({
        password: values.password,
      });

      //TODO: show QR code and button to download recovery codes

      //TODO: verify TOTP code
    }
  }

  return (
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

              <Button type="submit">Update account</Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
