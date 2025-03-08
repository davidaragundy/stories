import { ThemeSwitch } from "@/shared/components";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex relative min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="absolute top-4 right-4">
        <ThemeSwitch />
      </div>
      {children}
    </main>
  );
}
