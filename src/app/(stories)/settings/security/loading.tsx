import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { TypographyH4 } from "@/shared/components/ui/typography";

import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";
import { ActiveSessionCardSkeleton } from "@/features/settings/components/active-session-card-skeleton";

export default function Loading() {
  return (
    <div className="space-y-8">
      <SettingsPageHeader
        title="Security"
        description="Update your account's security settings."
      />

      <div className="space-y-8">
        <TypographyH4>Change password</TypographyH4>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-2 items-center justify-start">
            <span className="text-sm font-medium">New password</span>
            <Input
              disabled
              type="password"
              placeholder="••••••••"
              className="sm:max-w-[250px]"
            />
          </div>

          <p className="text-sm text-muted-foreground">
            If you change your password, all your active sessions will be logged
            out.
          </p>
        </div>

        <TypographyH4>Two-factor authentication</TypographyH4>

        <div className="flex flex-row items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <span className="text-base">Enable 2FA</span>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account.
            </p>
          </div>
          <Skeleton className="h-5 w-10 rounded-full" />
        </div>

        <TypographyH4>Backup codes</TypographyH4>

        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center justify-start">
            <span className="text-sm font-medium">Generate backup codes</span>
            <Button disabled type="button" size="sm" variant="outline">
              Generate
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            Generate a set of backup codes to use if you lose your authenticator
            app. If you already have backup codes, this will generate a new set
            and invalidate the old.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <TypographyH4 className="mb-4">Active sessions</TypographyH4>

          <ActiveSessionCardSkeleton />
          <ActiveSessionCardSkeleton />
          <ActiveSessionCardSkeleton />
        </div>
      </div>
    </div>
  );
}
