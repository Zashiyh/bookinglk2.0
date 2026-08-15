import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";
import { User } from "@/models/User";

function getToken(request: NextRequest) {
  return request.cookies.get("bookinglk_token")?.value;
}

/*
|--------------------------------------------------------------------------
| GET PROFILE
|--------------------------------------------------------------------------
*/

export async function GET(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to view your profile.",
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
      "-password"
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

    return NextResponse.json({
      success: true,
      data: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        avatar: user.avatar || null,
        isEmailVerified: user.isEmailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    console.error("GET_PROFILE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load profile.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| UPDATE PROFILE
|--------------------------------------------------------------------------
*/

export async function PUT(request: NextRequest) {
  try {
    const token = getToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to update your profile.",
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

    const user = await User.findById(payload.userId);

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

    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (firstName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "First name must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (firstName.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "First name cannot exceed 50 characters.",
        },
        { status: 400 }
      );
    }

    if (lastName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message: "Last name must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (lastName.length > 50) {
      return NextResponse.json(
        {
          success: false,
          message: "Last name cannot exceed 50 characters.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PHONE VALIDATION
    |--------------------------------------------------------------------------
    */

    if (phone.length > 30) {
      return NextResponse.json(
        {
          success: false,
          message: "Phone number is too long.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    user.firstName = firstName;
    user.lastName = lastName;
    user.phone = phone;

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully.",
      data: {
        id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone || "",
        role: user.role,
        avatar: user.avatar || null,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    console.error("UPDATE_PROFILE_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update profile.",
      },
      { status: 500 }
    );
  }
}