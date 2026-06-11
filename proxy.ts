import type { NextFetchEvent, NextRequest } from "next/server";
import type { NextRequestWithAuth } from "next-auth/middleware";
import { withAuth } from "next-auth/middleware";

const authProxy = withAuth({
  pages: {
    signIn: "/login",
  },
});

export function proxy(request: NextRequest, event: NextFetchEvent) {
  return authProxy(request as NextRequestWithAuth, event);
}

export const config = {
  matcher: [
    "/learn/:path*",
    "/games/:path*",
    "/mock-tests/:path*",
    "/progress/:path*",
    "/account/:path*",
  ],
};
