import { Skeleton } from "@/shared/components/ui/skeleton";

import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";

export default function Loading() {
  return (
    <div className="space-y-10">
      <SettingsPageHeader
        title="Account"
        description="Update your account settings."
      />

      <form className="space-y-8">
        <div className="space-y-2">
          <div className="flex gap-2 items-center justify-start">
            <label className="text-sm font-medium">Username</label>
            <Skeleton className="h-8 w-48" />
          </div>
          <p className="text-sm text-muted-foreground">
            This is your public display name. It can be your real name or a
            pseudonym.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 items-center justify-start">
            <label className="text-sm font-medium">Username</label>
            <Skeleton className="h-8 w-64" />
          </div>
          <p className="text-sm text-muted-foreground">
            This is your public display username. It can be your real name or a
            pseudonym.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex gap-2 items-center justify-start">
            <label className="text-sm font-medium">Email</label>
            <Skeleton className="h-8 w-48" />
          </div>
          <p className="text-sm text-muted-foreground">
            This is the email address we will use to contact you. It will not be
            publicly visible.
          </p>
        </div>
      </form>
    </div>
  );
}
