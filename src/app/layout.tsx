import type { Metadata } from "next";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";
import { Header, UIProviders } from "@/components";
import { validateRequest } from "@/lib";

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
  const { user } = await validateRequest();

  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <UIProviders>
          <Toaster />
          <div className="m-auto flex h-dvh w-full flex-col overflow-y-auto overflow-x-hidden lg:w-[65%]">
            <Header user={user} />
            {children}
          </div>
        </UIProviders>
      </body>
    </html>
  );
}
