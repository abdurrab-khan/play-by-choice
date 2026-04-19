import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/sign-in", "/sign-up", "/dashboard/:path*"],
};

export async function proxy(request: NextRequest) {
  const url = request.nextUrl.clone();
  const sessionToken = await getServerSession({
    request: request,
    secret: process.env.NEXT_AUTH_SECRET,
  });

  if (
    sessionToken &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-up") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    (!sessionToken && url.pathname.startsWith("/dashboard")) ||
    url.pathname === "/"
  ) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
