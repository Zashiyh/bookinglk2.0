import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { EmailVerification } from "@/models/EmailVerification";
import { sendVerificationEmail } from "@/lib/email/sendVerificationEmail";

interface RegisterBody {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phone?: string;
  resend?: boolean;
}

function generateVerificationCode(): string {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = (await req.json()) as RegisterBody;

    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : "";

    const email =
      typeof body.email === "string"
        ? body.email.trim().toLowerCase()
        : "";

    const password =
      typeof body.password === "string"
        ? body.password
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const isResend = body.resend === true;

    // ---------------------------------------------------------
    // VALIDATION
    // ---------------------------------------------------------

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name, last name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (firstName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (lastName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Last name must be at least 2 characters.",
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

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    // ---------------------------------------------------------
    // CHECK REAL USER
    // ---------------------------------------------------------

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists. Please log in.",
        },
        { status: 409 }
      );
    }

    // ---------------------------------------------------------
    // REMOVE OLD OTP
    // ---------------------------------------------------------

    await EmailVerification.deleteMany({
      email,
    });

    // ---------------------------------------------------------
    // HASH PASSWORD
    // ---------------------------------------------------------

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    // ---------------------------------------------------------
    // GENERATE OTP
    // ---------------------------------------------------------

    const code = generateVerificationCode();

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    // ---------------------------------------------------------
    // SAVE PENDING REGISTRATION
    // ---------------------------------------------------------

    await EmailVerification.create({
      email,
      firstName,
      lastName,
      password: hashedPassword,
      phone,
      code,
      expiresAt,
      attempts: 0,
    });

    // ---------------------------------------------------------
    // SEND EMAIL
    // ---------------------------------------------------------

    try {
      const mailResult =
        await sendVerificationEmail({
          email,
          firstName,
          code,
        });

      console.log(
        "BOOKINGLK VERIFICATION EMAIL:",
        mailResult.messageId
      );
    } catch (emailError) {
      console.error(
        "BOOKINGLK SMTP ERROR:",
        emailError
      );

      await EmailVerification.deleteMany({
        email,
      });

      return NextResponse.json(
        {
          success: false,
          message:
            "Verification email could not be sent. Please check your Gmail configuration.",
        },
        { status: 500 }
      );
    }

    // ---------------------------------------------------------
    // SUCCESS
    // ---------------------------------------------------------

    return NextResponse.json(
      {
        success: true,
        message: isResend
          ? "A new verification code has been sent to your email."
          : "Verification code sent to your email.",
        data: {
          email,
          expiresIn: 600,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "REGISTER_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating your account.",
      },
      { status: 500 }
    );
  }
}