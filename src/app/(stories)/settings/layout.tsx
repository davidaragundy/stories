import { Metadata } from "next";

import { ScrollArea } from "@/shared/components/ui/scroll-area";
import {
  TypographyH1,
  TypographyMuted,
} from "@/shared/components/ui/typography";

import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";
import { PageWrapper } from "@/features/settings/components/page-wrapper";
import { MobileWrapper } from "@/features/settings/components/mobile-wrapper";

export const metadata: Metadata = {
  title: "Stories | Settings",
};

export default function SettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-full flex flex-col space-y-8">
      <MobileWrapper>
        <div className="space-y-2">
          <TypographyH1>Settings</TypographyH1>

          <TypographyMuted>
            Manage your account settings and set e-mail preferences.
          </TypographyMuted>
        </div>
      </MobileWrapper>

      <div className="flex-1 flex gap-6 min-h-0">
        <SettingsSidebar />

        <PageWrapper>
          <ScrollArea className="flex-1 h-full">
            <div className="space-y-8 pb-16 px-4">{children}</div>
          </ScrollArea>
        </PageWrapper>
      </div>
    </div>
  );
}
