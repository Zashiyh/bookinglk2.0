import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { EmailVerification } from "@/models/EmailVerification";

interface VerifyBody {
  email?: string;
  code?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body =
      (await req.json()) as VerifyBody;

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    if (!email || !code) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and verification code are required.",
        },
        { status: 400 }
      );
    }

    if (!/^\d{6}$/.test(code)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code must contain 6 digits.",
        },
        { status: 400 }
      );
    }

    const pending =
      await EmailVerification.findOne({
        email,
      });

    if (!pending) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Verification request not found or has expired.",
        },
        { status: 404 }
      );
    }

    if (
      pending.expiresAt.getTime() <
      Date.now()
    ) {
      await EmailVerification.deleteOne({
        _id: pending._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Verification code has expired. Please request a new code.",
        },
        { status: 410 }
      );
    }

    if (pending.attempts >= 5) {
      await EmailVerification.deleteOne({
        _id: pending._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Too many incorrect attempts. Please request a new code.",
        },
        { status: 429 }
      );
    }

    if (pending.code !== code) {
      pending.attempts += 1;

      await pending.save();

      return NextResponse.json(
        {
          success: false,
          message:
            "Incorrect verification code.",
          attemptsRemaining:
            Math.max(
              0,
              5 - pending.attempts
            ),
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // CHECK USER AGAIN
    // ---------------------------------------------------------

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      await EmailVerification.deleteOne({
        _id: pending._id,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------------------
    // CREATE VERIFIED USER
    // ---------------------------------------------------------

    const user = await User.create({
      firstName: pending.firstName,
      lastName: pending.lastName,
      email: pending.email,
      password: pending.password,
      phone: pending.phone || "",
      role: "USER",
      isActive: true,
      isEmailVerified: true,
    });

    // ---------------------------------------------------------
    // DELETE OTP
    // ---------------------------------------------------------

    await EmailVerification.deleteOne({
      _id: pending._id,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Email verified and account created successfully.",
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone ?? "",
          role: user.role,
          isEmailVerified:
            user.isEmailVerified,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "VERIFY_EMAIL_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to verify your email.",
      },
      { status: 500 }
    );
  }
}