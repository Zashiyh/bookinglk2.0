
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token =
      req.cookies.get("bookinglk_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Not authenticated.",
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
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
    ).select("-password");

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
          message: "Account is disabled.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          id: user._id.toString(),

          firstName:
            typeof user.firstName === "string"
              ? user.firstName
              : "",

          lastName:
            typeof user.lastName === "string"
              ? user.lastName
              : "",

          email:
            typeof user.email === "string"
              ? user.email
              : "",

          phone:
            typeof user.phone === "string"
              ? user.phone
              : "",

          role: user.role,

          avatar:
            typeof user.avatar === "string"
              ? user.avatar
              : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "AUTH_ME_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load user.",
      },
      { status: 500 }
    );
  }
}

