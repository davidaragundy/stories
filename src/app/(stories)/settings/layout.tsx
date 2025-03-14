import { Metadata } from "next";
import { H2, P, Separator } from "@/shared/components";
import { SidebarNav } from "@/features/settings/components";

export const metadata: Metadata = {
  title: "Stories | Settings",
};

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings",
  },
  {
    title: "Account",
    href: "/settings/account",
  },
  {
    title: "Notifications",
    href: "/settings/notifications",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6 p-10 pb-16 md:block">
      <div className="space-y-0.5">
        <H2 className="text-2xl font-bold tracking-tight">Settings</H2>
        <P className="text-muted-foreground">
          Manage your account settings and set e-mail preferences.
        </P>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
