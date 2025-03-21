import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const authURLs = [
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/2fa",
    "/recovery",
  ];
  const isAuthURL = authURLs.includes(request.nextUrl.pathname);

  const publicURLs: string[] = ["/terms", "/privacy"];
  const isPublicURL = publicURLs.includes(request.nextUrl.pathname);

  const sessionCookie = getSessionCookie(request, {
    cookiePrefix: "stories",
  });

  if (isPublicURL) return NextResponse.next();

  if (!sessionCookie) {
    return isAuthURL
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return isAuthURL
    ? NextResponse.redirect(new URL("/home", request.url))
    : NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
