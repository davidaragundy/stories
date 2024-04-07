import { verifyRequestOrigin } from "lucia";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest): Promise<NextResponse> {
  if (request.method === "GET") {
    return NextResponse.next();
  }

  const originHeader = request.headers.get("Origin");
  const hostHeader = request.headers.get("X-Forwarded-Host");

  if (
    !originHeader ||
    !hostHeader ||
    !verifyRequestOrigin(originHeader, [hostHeader])
  )
    return new NextResponse(null, {
      status: 403,
    });

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
