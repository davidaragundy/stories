import { NotificationsForm } from "@/features/settings/components/notifications-form";
import { SettingsPageHeader } from "@/features/settings/components/settings-page-header";

export default function SettingsNotificationsPage() {
  return (
    <>
      <SettingsPageHeader
        title="Notifications"
        description="Configure how you receive notifications."
      />

      <NotificationsForm />
    </>
  );
}
