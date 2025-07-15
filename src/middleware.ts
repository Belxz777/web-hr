import { NextResponse } from "next/server";

export function middleware(request: {
  cookies: { get: (arg0: string) => any };
  nextUrl: { pathname: any };
  url: string | URL | undefined;
}) {
  const token = request.cookies.get("cf-auth-id");

  const { pathname } = request.nextUrl;

  if (token) {
    if (pathname === "/login" || pathname === "/register") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/profile", request.url));
    }
  } else {
    const protectedPaths = [
      "/profile",
      "/changePass",
      "/report",
      "/department",
    ];

    if (protectedPaths.includes(pathname)) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/dashboard", "/profile"],
};
