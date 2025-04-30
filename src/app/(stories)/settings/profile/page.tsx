import { H3 } from "@/shared/components/ui/h3";
import { P } from "@/shared/components/ui/p";
import { Separator } from "@/shared/components/ui/separator";

import { ProfileForm } from "@/features/settings/components/profile-form";

export default function SettingsProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <H3 className="text-lg font-medium">Profile</H3>
        <P className="text-sm text-muted-foreground">
          This is how others will see you on the site.
        </P>
      </div>
      <Separator />
      <ProfileForm />
    </div>
  );
}
