import { Large } from "@/shared/components/ui/large";
import { ThemeSwitch } from "@/shared/components/theme-switch";

import { SignOutButton } from "@/features/auth/components/sign-out-button";

export default function StoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-svh gap-6 p-6 md:p-10">
      <header className="flex items-center justify-between">
        <Large className="font-extrabold text-2xl">Stories</Large>

        <div className="flex items-center justify-between gap-2">
          <SignOutButton />
          <ThemeSwitch />
        </div>
      </header>

      {children}
    </div>
  );
}
