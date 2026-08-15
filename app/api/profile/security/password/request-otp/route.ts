import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";
import { User } from "@/models/User";
import SecurityOTP from "@/models/SecurityOTP";
import { sendSecurityOTP } from "@/lib/email/sendSecurityOTP";

function getToken(request: NextRequest) {
  return request.cookies.get("bookinglk_token")?.value;
}

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
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

    const user = await User.findById(payload.userId).select(
      "+password"
    );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account is disabled.",
        },
        { status: 403 }
      );
    }

    const body = await request.json();

    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword
        : "";

    if (!currentPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter your current password.",
        },
        { status: 400 }
      );
    }

    if (!user.password) {
      return NextResponse.json(
        {
          success: false,
          message: "Password information is unavailable.",
        },
        { status: 500 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!passwordMatches) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password is incorrect.",
        },
        { status: 400 }
      );
    }

    await SecurityOTP.deleteMany({
      userId: user._id,
      purpose: "CHANGE_PASSWORD",
    });

    const otp = generateOTP();

    const otpHash = await bcrypt.hash(otp, 10);

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    await SecurityOTP.create({
      userId: user._id,
      email: user.email,
      otpHash,
      purpose: "CHANGE_PASSWORD",
      expiresAt,
      attempts: 0,
      verified: false,
    });

    await sendSecurityOTP({
      email: user.email,
      firstName: user.firstName,
      otp,
      purpose: "CHANGE_PASSWORD",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Verification code has been sent to your registered email.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("REQUEST_PASSWORD_OTP_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to send verification code. Please try again.",
      },
      { status: 500 }
    );
  }
}