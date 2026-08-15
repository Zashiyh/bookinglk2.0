import { NextRequest, NextResponse } from "next/server";

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

    const user = await User.findById(
      payload.userId
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

    const verifiedOTP =
      await SecurityOTP.findOne({
        userId: user._id,
        purpose: "CHANGE_EMAIL",
        verified: true,
      }).sort({
        createdAt: -1,
      });

    if (!verifiedOTP) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify the email verification code first.",
        },
        { status: 403 }
      );
    }

    const verificationExpired =
      Date.now() -
        verifiedOTP.createdAt.getTime() >
      15 * 60 * 1000;

    if (verificationExpired) {
      await verifiedOTP.deleteOne();

      return NextResponse.json(
        {
          success: false,
          message:
            "Email verification has expired. Please request a new code.",
        },
        { status: 403 }
      );
    }

    const newEmail =
      verifiedOTP.email
        .trim()
        .toLowerCase();

    if (!newEmail) {
      return NextResponse.json(
        {
          success: false,
          message:
            "New email address is unavailable.",
        },
        { status: 400 }
      );
    }

    const existingUser =
      await User.findOne({
        email: newEmail,
        _id: { $ne: user._id },
      });

    if (existingUser) {
      await SecurityOTP.deleteMany({
        userId: user._id,
        purpose: "CHANGE_EMAIL",
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "This email address is already registered.",
        },
        { status: 409 }
      );
    }

    user.email = newEmail;

    await user.save();

    await SecurityOTP.deleteMany({
      userId: user._id,
      purpose: "CHANGE_EMAIL",
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Your email address has been changed successfully.",
        data: {
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "CHANGE_EMAIL_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to change your email address. Please try again.",
      },
      { status: 500 }
    );
  }
}