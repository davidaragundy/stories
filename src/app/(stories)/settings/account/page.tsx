import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Separator } from "@/shared/components";
import { auth } from "@/shared/lib/auth";
import { AccountForm } from "@/features/settings/components";

export default async function SettingsAccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return redirect("/sign-in");
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account</h3>
        <p className="text-sm text-muted-foreground">
          Update your account settings.
        </p>
      </div>
      <Separator />
      <AccountForm session={session} />
    </div>
  );
}
