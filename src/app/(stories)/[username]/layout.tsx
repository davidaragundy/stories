import { ReactNode } from "react";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}) {
  return {
    title: `Stories | ${params.username}`,
  };
}

export default async function UsernameLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <>{children}</>;
}
