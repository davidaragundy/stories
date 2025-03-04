import type { Metadata } from "next";
import { ThemeProvider } from "@/shared/components";

import "@/shared/styles/globals.css";

export const metadata: Metadata = {
  title: "Stories | Home",
  description: "Fuck it, we balling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

