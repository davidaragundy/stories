import { headers } from "next/headers";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

import { AppSidebar } from "@/shared/components/app-sidebar";
import { auth } from "@/shared/lib/better-auth/server";
import { SESSION_QUERY_KEY } from "@/shared/lib/react-query/query-key-factory";

export default async function StoriesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [SESSION_QUERY_KEY],
    queryFn: async () => {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      return session;
    },
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-svh gap-6 px-2 py-4 sm:px-6 sm:py-8 md:p-10 overflow-hidden">
        <AppSidebar />

        <main className="flex-1 h-full">{children}</main>
      </div>
    </HydrationBoundary>
  );
}
