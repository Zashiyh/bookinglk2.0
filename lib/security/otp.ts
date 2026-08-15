import crypto from "crypto";

export const OTP_EXPIRY_MINUTES = 10;
export const MAX_OTP_ATTEMPTS = 5;
export const OTP_RESEND_SECONDS = 60;

export function generateOTP(): string {
  return crypto
    .randomInt(100000, 1000000)
    .toString();
}

export function hashOTP(
  otp: string
): string {
  return crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");
}

export function verifyOTP(
  otp: string,
  hashedOTP: string
): boolean {
  const hashed = hashOTP(otp);

  return crypto.timingSafeEqual(
    Buffer.from(hashed),
    Buffer.from(hashedOTP)
  );
}

export function getOTPExpiry(): Date {
  return new Date(
    Date.now() +
      OTP_EXPIRY_MINUTES * 60 * 1000
  );
}