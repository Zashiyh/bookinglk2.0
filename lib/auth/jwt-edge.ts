import { jwtVerify } from "jose";

export type UserRole =
  | "USER"
  | "HOTEL_OWNER"
  | "HOTEL_MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface EdgeJWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

function getSecret() {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is not defined.");
  }

  return new TextEncoder().encode(secret);
}

export async function verifyTokenEdge(
  token: string
): Promise<EdgeJWTPayload | null> {
  try {
    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token,
      getSecret()
    );

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string"
    ) {
      return null;
    }

    const validRoles: UserRole[] = [
      "USER",
      "HOTEL_OWNER",
      "HOTEL_MANAGER",
      "ADMIN",
      "SUPER_ADMIN",
    ];

    if (
      !validRoles.includes(
        payload.role as UserRole
      )
    ) {
      return null;
    }

    return {
      userId: payload.userId,
      email: payload.email,
      role: payload.role as UserRole,
    };
  } catch (error) {
    console.error(
      "EDGE_VERIFY_TOKEN_ERROR:",
      error
    );

    return null;
  }
}