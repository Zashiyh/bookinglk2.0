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

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid admin credentials.",
        },
        { status: 401 }
      );
    }

    if (
      user.role !== "ADMIN" &&
      user.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have admin access.",
        },
        { status: 403 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This admin account is disabled.",
        },
        { status: 403 }
      );
    }

    const passwordValid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!passwordValid) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid admin credentials.",
        },
        { status: 401 }
      );
    }

    const token = createToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    const response =
      NextResponse.json({
        success: true,
        message:
          "Admin login successful.",
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
      });

    response.cookies.set({
      name: "bookinglk_token",
      value: token,
      httpOnly: true,
      secure:
        process.env.NODE_ENV ===
        "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(
      "ADMIN_LOGIN_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while logging in.",
      },
      { status: 500 }
    );
  }
}