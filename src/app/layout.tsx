import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import { Header, UIProviders } from "@/components";

export const metadata: Metadata = {
  title: "Stories",
  description:
    "The place where you can share your stories and nobody will give a fuck. 🌴",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <SessionProvider session={session}>
          <UIProviders>
            <Toaster />
            <div className="m-auto flex h-screen w-full flex-col overflow-hidden lg:w-[65%]">
              <Header />
              {children}
            </div>
          </UIProviders>
        </SessionProvider>
      </body>
    </html>
  );
}
