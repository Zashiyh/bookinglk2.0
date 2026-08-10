import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { User, UserRole } from "@/models/User";
import { verifyToken } from "@/lib/auth/jwt";

const allowedRoles: UserRole[] = [
  "ADMIN",
  "HOTEL_OWNER",
  "HOTEL_MANAGER",
];

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Get JWT
    const token =
      req.cookies.get("bookinglk_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 }
      );
    }

    // Verify JWT
    const currentUser = verifyToken(token);

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session.",
        },
        { status: 401 }
      );
    }

    // Only SUPER_ADMIN can create staff accounts
    if (currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only Super Admin can create staff accounts.",
        },
        { status: 403 }
      );
    }

    const body = await req.json();

    const firstName = String(
      body.firstName || ""
    ).trim();

    const lastName = String(
      body.lastName || ""
    ).trim();

    const email = String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
      body.phone || ""
    ).trim();

    const password = String(
      body.password || ""
    );

    const role = String(
      body.role || ""
    ) as UserRole;

    // Required fields
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !role
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name, last name, email, password and role are required.",
        },
        { status: 400 }
      );
    }

    // Validate role
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid staff role.",
        },
        { status: 400 }
      );
    }

    // Validate password
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

    // Validate email
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // Check existing account
    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword =
      await bcrypt.hash(password, 12);

    // Create account
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password: hashedPassword,
      role,
      isActive: true,
      isEmailVerified: true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          `${role} account created successfully.`,
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isActive: user.isActive,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "ADMIN_CREATE_USER_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating the account.",
      },
      { status: 500 }
    );
  }
}