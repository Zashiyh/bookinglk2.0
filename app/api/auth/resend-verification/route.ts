import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { EmailVerification } from "@/models/EmailVerification";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";

interface ResendBody {
  email?: unknown;
}

function generateVerificationCode(): string {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body =
      (await req.json()) as ResendBody;

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    /*
    |--------------------------------------------------------------------------
    | VALIDATE EMAIL
    |--------------------------------------------------------------------------
    */

    if (!email) {
      return NextResponse.json(
        {
          success: false,
          message: "Email address is required.",
        },
        { status: 400 }
      );
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK IF ALREADY VERIFIED
    |--------------------------------------------------------------------------
    */

    const existingUser =
      await User.findOne({ email });

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json(
          {
            success: false,
            message:
              "This email is already verified. Please log in.",
          },
          { status: 409 }
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | FIND PENDING REGISTRATION
    |--------------------------------------------------------------------------
    */

    const pending =
      await EmailVerification.findOne({
        email,
      });

    if (!pending) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No pending verification was found. Please register again.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | GENERATE NEW OTP
    |--------------------------------------------------------------------------
    */

    const verificationCode =
      generateVerificationCode();

    const expiresAt =
      new Date(
        Date.now() +
          10 * 60 * 1000
      );

    /*
    |--------------------------------------------------------------------------
    | UPDATE PENDING VERIFICATION
    |--------------------------------------------------------------------------
    */

    pending.code =
      verificationCode;

    pending.expiresAt =
      expiresAt;

    pending.attempts = 0;

    await pending.save();

    /*
    |--------------------------------------------------------------------------
    | SEND NEW EMAIL
    |--------------------------------------------------------------------------
    */

    try {
      await sendVerificationEmail({
        email: pending.email,
        firstName: pending.firstName,
        code: verificationCode,
      });
    } catch (emailError) {
      console.error(
        "RESEND_VERIFICATION_EMAIL_ERROR:",
        emailError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "We could not send the verification email. Please try again.",
        },
        { status: 500 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        success: true,
        message:
          "A new verification code has been sent to your email.",
        data: {
          email,
          expiresIn: 600,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "RESEND_VERIFICATION_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while resending the verification code.",
      },
      { status: 500 }
    );
  }
}