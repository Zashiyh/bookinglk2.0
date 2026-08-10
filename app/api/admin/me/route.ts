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
          message: "Administrator authentication required.",
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired administrator session.",
        },
        { status: 401 }
      );
    }

    if (
      payload.role !== "ADMIN" &&
      payload.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findById(
      payload.userId
    )
      .select("-password")
      .lean();

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator account not found.",
        },
        { status: 404 }
      );
    }

    if (user.isActive === false) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator account is disabled.",
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: String(user._id),
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
        role: user.role,
        avatar:
          typeof user.avatar === "string"
            ? user.avatar
            : null,
      },
    });
  } catch (error) {
    console.error("ADMIN_ME_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load administrator.",
      },
      { status: 500 }
    );
  }
}