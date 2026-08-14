import crypto from "crypto";

export function generateVerificationCode(): string {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

export function hashVerificationCode(
  code: string
): string {
  return crypto
    .createHash("sha256")
    .update(code)
    .digest("hex");
}