import { NextResponse } from "next/server";
import { auth } from "@/lib";

export default auth((request) => {
  if (
    request.nextUrl.pathname.startsWith("/signIn") ||
    request.nextUrl.pathname.startsWith("/signUp")
  ) {
    return request.auth
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  return request.auth
    ? NextResponse.next()
    : NextResponse.redirect(new URL("/signIn", request.url));
});

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
