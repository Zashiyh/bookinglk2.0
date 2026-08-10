import { NextRequest } from "next/server";

import { verifyToken } from "@/lib/auth/jwt";

export function getAdminFromRequest(
  req: NextRequest
) {
  const token =
    req.cookies.get(
      "bookinglk_token"
    )?.value;

  if (!token) {
    return null;
  }

  const payload =
    verifyToken(token);

  if (!payload) {
    return null;
  }

  if (
    payload.role !== "ADMIN" &&
    payload.role !== "SUPER_ADMIN"
  ) {
    return null;
  }

  return payload;
}