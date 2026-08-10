import jwt, {
  JwtPayload,
  SignOptions,
} from "jsonwebtoken";

import { jwtVerify } from "jose";

export type UserRole =
  | "USER"
  | "HOTEL_OWNER"
  | "HOTEL_MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface JWTPayload {
  userId: string;
  email: string;
  role: UserRole;
}

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET is not defined in .env.local"
    );
  }

  return secret;
}

/*
|--------------------------------------------------------------------------
| Create token
|--------------------------------------------------------------------------
| jsonwebtoken is OK here because API routes run on Node.js runtime.
*/

export function createToken(
  payload: JWTPayload
): string {
  const secret = getJWTSecret();

  const options: SignOptions = {
    expiresIn: "7d",
  };

  return jwt.sign(
    payload,
    secret,
    options
  );
}

/*
|--------------------------------------------------------------------------
| Normal server/API token verification
|--------------------------------------------------------------------------
*/

export function verifyToken(
  token: string
): JWTPayload | null {
  try {
    if (!token) {
      return null;
    }

    const secret = getJWTSecret();

    const decoded = jwt.verify(
      token,
      secret
    );

    if (
      typeof decoded === "string" ||
      !decoded
    ) {
      return null;
    }

    const payload =
      decoded as JwtPayload & {
        userId?: unknown;
        email?: unknown;
        role?: unknown;
      };

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
      "VERIFY_TOKEN_ERROR:",
      error
    );

    return null;
  }
}

/*
|--------------------------------------------------------------------------
| Edge Runtime token verification
|--------------------------------------------------------------------------
| IMPORTANT:
| middleware.ts MUST use this function.
*/

export async function verifyTokenEdge(
  token: string
): Promise<JWTPayload | null> {
  try {
    if (!token) {
      return null;
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "JWT_SECRET is not defined."
      );

      return null;
    }

    const encodedSecret =
      new TextEncoder().encode(secret);

    const { payload } =
      await jwtVerify(
        token,
        encodedSecret
      );

    if (
      typeof payload.userId !==
      "string" ||
      typeof payload.email !==
      "string" ||
      typeof payload.role !==
      "string"
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
      role:
        payload.role as UserRole,
    };
  } catch (error) {
    console.error(
      "VERIFY_TOKEN_EDGE_ERROR:",
      error
    );

    return null;
  }
}