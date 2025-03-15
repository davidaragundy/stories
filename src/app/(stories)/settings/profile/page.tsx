import { H3, P, Separator } from "@/shared/components";
import { ProfileForm } from "@/features/settings/components";

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
