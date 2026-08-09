import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes
  const publicRoutes = [
    "/",
    "/login",
    "/register",
    "/hotels",
    "/destinations",
    "/explore",
    "/deals",
  ];

  const isPublicRoute = publicRoutes.some(
    (route) =>
      pathname === route ||
      pathname.startsWith(`${route}/`)
  );

  // Allow public routes
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Get JWT from cookie
  const token = request.cookies.get("token")?.value;

  /*
   * Protected routes
   */
  const isDashboardRoute =
    pathname.startsWith("/dashboard");

  const isAdminRoute =
    pathname.startsWith("/admin");

  // Dashboard requires login
  if (isDashboardRoute) {
    if (!token) {
      const loginUrl = new URL(
        "/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    const user = verifyToken(token);

    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );

      response.cookies.delete("token");

      return response;
    }

    return NextResponse.next();
  }

  /*
   * Admin routes
   */
  if (isAdminRoute) {
    if (!token) {
      const loginUrl = new URL(
        "/login",
        request.url
      );

      loginUrl.searchParams.set(
        "redirect",
        pathname
      );

      return NextResponse.redirect(loginUrl);
    }

    const user = verifyToken(token);

    if (!user) {
      const response = NextResponse.redirect(
        new URL("/login", request.url)
      );

      response.cookies.delete("token");

      return response;
    }

    /*
     * Only ADMIN and SUPER_ADMIN
     * can access /admin
     */
    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.redirect(
        new URL("/", request.url)
      );
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};