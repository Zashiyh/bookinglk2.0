import {
  NextRequest,
  NextResponse,
} from "next/server";

import { verifyTokenEdge } from "@/lib/auth/jwt-edge";

export async function middleware(
  request: NextRequest
) {
  const { pathname } = request.nextUrl;

  console.log("ADMIN MIDDLEWARE");
  console.log("PATH:", pathname);

  // ============================================
  // ADMIN LOGIN
  // ============================================

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // ============================================
  // ADMIN ROUTES
  // ============================================

  if (
    pathname === "/admin" ||
    pathname.startsWith("/admin/")
  ) {
    const token =
      request.cookies.get(
        "bookinglk_token"
      )?.value;

    console.log(
      "ADMIN MIDDLEWARE TOKEN:",
      token ? "FOUND" : "NOT FOUND"
    );

    // No token
    if (!token) {
      console.log(
        "ADMIN REDIRECT: NO TOKEN"
      );

      return NextResponse.redirect(
        new URL(
          "/admin/login",
          request.url
        )
      );
    }

    // Edge-compatible JWT verification
    const user =
      await verifyTokenEdge(token);

    console.log(
      "ADMIN MIDDLEWARE USER:",
      user
    );

    // Invalid token
    if (!user) {
      console.log(
        "ADMIN REDIRECT: INVALID TOKEN"
      );

      const response =
        NextResponse.redirect(
          new URL(
            "/admin/login",
            request.url
          )
        );

      response.cookies.delete(
        "bookinglk_token"
      );

      return response;
    }

    // Admin permission
    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      console.log(
        "ADMIN REDIRECT: NOT ADMIN",
        user.role
      );

      return NextResponse.redirect(
        new URL(
          "/",
          request.url
        )
      );
    }

    console.log(
      "ADMIN ACCESS GRANTED:",
      user.email
    );

    return NextResponse.next();
  }

  // ============================================
  // NORMAL USER DASHBOARD
  // ============================================

  if (
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/")
  ) {
    const token =
      request.cookies.get(
        "bookinglk_token"
      )?.value;

    if (!token) {
      return NextResponse.redirect(
        new URL(
          "/login",
          request.url
        )
      );
    }

    const user =
      await verifyTokenEdge(token);

    if (!user) {
      const response =
        NextResponse.redirect(
          new URL(
            "/login",
            request.url
          )
        );

      response.cookies.delete(
        "bookinglk_token"
      );

      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/dashboard/:path*",
  ],
};