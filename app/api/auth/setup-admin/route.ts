import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    const setupSecret = process.env.ADMIN_SETUP_SECRET;

    if (!setupSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "ADMIN_SETUP_SECRET is not configured.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const providedSecret = String(
      body.setupSecret || ""
    );

    if (providedSecret !== setupSecret) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid setup secret.",
        },
        { status: 403 }
      );
    }

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

    const password = String(
      body.password || ""
    );

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name, last name, email and password are required.",
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

    const hashedPassword = await bcrypt.hash(
      password,
      12
    );

    const admin = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,

      role: "SUPER_ADMIN",

      isActive: true,
      isEmailVerified: true,
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Super admin account created successfully.",

        data: {
          id: admin._id.toString(),
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "SETUP_ADMIN_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Something went wrong while creating the admin.",
      },
      { status: 500 }
    );
  }
}