import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";

interface RegisterBody {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body =
      (await req.json()) as RegisterBody;

    const {
      firstName,
      lastName,
      email,
      password,
      phone,
    } = body;

    // -----------------------------
    // Required fields
    // -----------------------------

    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
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

    // -----------------------------
    // Clean values
    // -----------------------------

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const normalizedEmail =
      email.trim().toLowerCase();

    // -----------------------------
    // Validate name
    // -----------------------------

    if (cleanFirstName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "First name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (cleanLastName.length < 2) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Last name must be at least 2 characters.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate email
    // -----------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please enter a valid email address.",
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Validate password
    // -----------------------------

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

    // -----------------------------
    // Check existing user
    // -----------------------------

    const existingUser =
      await User.findOne({
        email: normalizedEmail,
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

    // -----------------------------
    // Hash password
    // -----------------------------

    const hashedPassword =
      await bcrypt.hash(password, 12);

    // -----------------------------
    // Create user
    // -----------------------------

    const user = await User.create({
      firstName: cleanFirstName,
      lastName: cleanLastName,
      email: normalizedEmail,
      password: hashedPassword,
      phone:
        typeof phone === "string"
          ? phone.trim()
          : "",
      role: "USER",
      isActive: true,
    });

    // -----------------------------
    // Response
    // -----------------------------

    return NextResponse.json(
      {
        success: true,
        message:
          "Account created successfully.",
        data: {
          id: user._id.toString(),
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
          role: user.role,
        },
      },
      { status: 201 }
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
          "Something went wrong while creating the account.",
      },
      { status: 500 }
    );
  }
}