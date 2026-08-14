import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { createToken } from "@/lib/auth/jwt";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();

    const email = String(body.email || "")
      .trim()
      .toLowerCase();

    const password = String(body.password || "");

    /*
    |--------------------------------------------------------------------------
    | Validate input
    |--------------------------------------------------------------------------
    */

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message: "Email and password are required.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Find user
    |--------------------------------------------------------------------------
    */

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Account status
    |--------------------------------------------------------------------------
    */

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message: "Your account has been disabled.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check email verification
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | A user MUST verify their email before login.
    |
    */

    if (!user.isEmailVerified) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please verify your email address before signing in.",
          code: "EMAIL_NOT_VERIFIED",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Check password
    |--------------------------------------------------------------------------
    */

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | Create JWT
    |--------------------------------------------------------------------------
    */

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    /*
    |--------------------------------------------------------------------------
    | Response
    |--------------------------------------------------------------------------
    */

    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful.",
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
      {
        status: 200,
      }
    );

    /*
    |--------------------------------------------------------------------------
    | AUTH COOKIE
    |--------------------------------------------------------------------------
    */

    response.cookies.set({
      name: "bookinglk_token",

      value: token,

      httpOnly: true,

      secure:
        process.env.NODE_ENV === "production",

      sameSite: "lax",

      path: "/",

      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(
      "LOGIN_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while logging in.",
      },
      {
        status: 500,
      }
    );
  }
}