import { headers as nextHeaders } from "next/headers";

import { auth } from "@/shared/lib/better-auth/server";

export async function GET(request: Request) {
  if (
    !process.env.ELECTRIC_URL ||
    !process.env.ELECTRIC_SOURCE_ID ||
    !process.env.ELECTRIC_SOURCE_SECRET
  ) {
    return new Response(`ELECTRIC variables are not set`, { status: 500 });
  }

  const url = new URL(request.url);

  // Construct the upstream URL
  const originUrl = new URL(process.env.ELECTRIC_URL);

  // Add the query params
  url.searchParams.forEach((value, key) => {
    originUrl.searchParams.set(key, value);
  });

  // Set the source_id
  originUrl.searchParams.set(`source_id`, process.env.ELECTRIC_SOURCE_ID);

  // Set the source_secret
  originUrl.searchParams.set(
    `source_secret`,
    process.env.ELECTRIC_SOURCE_SECRET
  );

  // Authentication and Authorization
  const session = await auth.api.getSession({
    headers: await nextHeaders(),
  });

  // If no session, return 401
  //TODO: we need more granular access control,
  // an authenticated user should be able to see their own data.
  // For now, we'll just check if the user is authenticated.
  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Only query data the user has access to.
  //   originUrl.searchParams.set(`where`, `"user_id" = ${session.user.id}`);

  const response = await fetch(originUrl);

  // Fetch decompresses the body but doesn't remove the
  // content-encoding & content-length headers which would
  // break decoding in the browser.
  //
  // See https://github.com/whatwg/fetch/issues/1729
  const headers = new Headers(response.headers);

  headers.delete(`content-encoding`);
  headers.delete(`content-length`);

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
