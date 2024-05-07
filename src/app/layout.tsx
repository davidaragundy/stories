import type { Metadata } from "next";
import "@/styles/globals.css";
import { Header, RootProviders } from "@/components";
import { validateRequest } from "@/lib";
import { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "The place where you can share your stories and nobody will give a fuck. 🌴",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const { user } = await validateRequest();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <RootProviders user={user}>
          <div className="m-auto flex h-dvh w-full flex-col overflow-y-auto overflow-x-hidden lg:w-[clamp(60rem,70%,70rem)]">
            <Header />
            {children}
          </div>
        </RootProviders>
      </body>
    </html>
  );
}
