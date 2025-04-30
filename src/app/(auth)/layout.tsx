import { ThemeSwitch } from "@/shared/components/theme-switch";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col min-h-svh p-6 md:p-10">
      <header className="flex items-center justify-end gap-2">
        <div className="flex items-center justify-between gap-2">
          <ThemeSwitch />
        </div>
      </header>
      <main className="flex flex-1 flex-col items-center justify-center gap-6">
        {children}
      </main>
    </div>
  );
}
