import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";
import { User } from "@/models/User";
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

    const newPassword =
      typeof body.newPassword === "string"
        ? body.newPassword
        : "";

    const confirmPassword =
      typeof body.confirmPassword === "string"
        ? body.confirmPassword
        : "";

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter and confirm your new password.",
        },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New password must contain at least 8 characters.",
        },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Passwords do not match.",
        },
        { status: 400 }
      );
    }

    /*
     * Find the latest verified password OTP.
     */

    const securityOTP = await SecurityOTP.findOne({
      userId: user._id,
      purpose: "CHANGE_PASSWORD",
      verified: true,
    }).sort({
      createdAt: -1,
    });

    if (!securityOTP) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify the security code before changing your password.",
        },
        { status: 400 }
      );
    }

    /*
     * Check OTP expiry.
     */

    if (securityOTP.expiresAt.getTime() < Date.now()) {
      await SecurityOTP.deleteOne({
        _id: securityOTP._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Your verification code has expired. Please request a new code.",
        },
        { status: 400 }
      );
    }

    /*
     * Prevent using the same password.
     */

    if (user.password) {
      const samePassword = await bcrypt.compare(
        newPassword,
        user.password
      );

      if (samePassword) {
        return NextResponse.json(
          {
            success: false,
            message:
              "New password must be different from your current password.",
          },
          { status: 400 }
        );
      }
    }

    /*
     * Hash the new password.
     */

    const hashedPassword = await bcrypt.hash(
      newPassword,
      12
    );

    user.password = hashedPassword;

    await user.save();

    /*
     * Remove the used OTP.
     */

    await SecurityOTP.deleteOne({
      _id: securityOTP._id,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your password has been changed successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "CHANGE_PASSWORD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to change password. Please try again.",
      },
      { status: 500 }
    );
  }
}