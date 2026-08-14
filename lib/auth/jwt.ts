import jwt, {
  JwtPayload,
  SignOptions,
} from "jsonwebtoken";

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