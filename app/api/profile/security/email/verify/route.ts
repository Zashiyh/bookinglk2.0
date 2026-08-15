import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";
import SecurityOTP from "@/models/SecurityOTP";

function getToken(request: NextRequest) {
  return request.cookies.get("bookinglk_token")?.value;
}

export async function POST(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in first.",
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload?.userId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    await connectDB();

    const body = await request.json();

    const otp =
      typeof body.otp === "string"
        ? body.otp.trim()
        : "";

    if (!/^\d{6}$/.test(otp)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter the 6-digit verification code.",
        },
        { status: 400 }
      );
    }

    const otpRecord =
      await SecurityOTP.findOne({
        userId: payload.userId,
        purpose: "CHANGE_EMAIL",
        verified: false,
      }).sort({
        createdAt: -1,
      });

    if (!otpRecord) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code not found. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (
      otpRecord.expiresAt.getTime() <
      Date.now()
    ) {
      await otpRecord.deleteOne();

      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    if (otpRecord.attempts >= 5) {
      await otpRecord.deleteOne();

      return NextResponse.json(
        {
          success: false,
          message:
            "Too many incorrect attempts. Please request a new code.",
        },
        { status: 429 }
      );
    }

    const validOTP =
      await bcrypt.compare(
        otp,
        otpRecord.otpHash
      );

    if (!validOTP) {
      otpRecord.attempts += 1;

      await otpRecord.save();

      return NextResponse.json(
        {
          success: false,
          message:
            "Incorrect verification code.",
        },
        { status: 400 }
      );
    }

    otpRecord.verified = true;

    await otpRecord.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Email verification successful.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "EMAIL_OTP_VERIFY_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify the verification code.",
      },
      { status: 500 }
    );
  }
}