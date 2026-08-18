import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";
import { User } from "@/models/User";


// GET TOKEN

function getToken(
  request: NextRequest
): string | null {
  return (
    request.cookies.get("bookinglk_token")?.value ||
    null
  );
}


// GET CURRENT USER

async function getCurrentUser(
  request: NextRequest
) {
  const token = getToken(request);

  if (!token) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Please log in first.",
        },
        { status: 401 }
      ),
    };
  }

  const payload = verifyToken(token);

  if (!payload?.userId) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Invalid or expired session.",
        },
        { status: 401 }
      ),
    };
  }

  await connectDB();

  const user = await User.findById(
    payload.userId
  );

  if (!user) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      ),
    };
  }

  if (!user.isActive) {
    return {
      error: NextResponse.json(
        {
          success: false,
          message: "Your account is disabled.",
        },
        { status: 403 }
      ),
    };
  }

  return {
    user,
  };
}


// PUT - UPLOAD / CHANGE AVATAR

export async function PUT(
  request: NextRequest
) {
  try {
    const result =
      await getCurrentUser(request);

    if ("error" in result) {
      return result.error;
    }

    const { user } = result;

    /*
    |--------------------------------------------------------------------------
    | FORM DATA
    |--------------------------------------------------------------------------
    */

    const formData =
      await request.formData();

    const file =
      formData.get("avatar");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please select an image.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FILE TYPE
    |--------------------------------------------------------------------------
    */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only JPG, PNG and WebP images are allowed.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FILE SIZE
    |--------------------------------------------------------------------------
    */

    const maxSize =
      5 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Image must be smaller than 5MB.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CONVERT IMAGE TO DATA URL
    |--------------------------------------------------------------------------
    */

    const bytes =
      await file.arrayBuffer();

    const buffer =
      Buffer.from(bytes);

    const base64 =
      buffer.toString("base64");

    const avatar =
      `data:${file.type};base64,${base64}`;

    /*
    |--------------------------------------------------------------------------
    | SAVE
    |--------------------------------------------------------------------------
    */

    user.avatar = avatar;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Profile picture updated successfully.",
        data: {
          avatar: user.avatar,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE_AVATAR_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update profile picture.",
      },
      { status: 500 }
    );
  }
}


// DELETE - REMOVE AVATAR

export async function DELETE(
  request: NextRequest
) {
  try {
    const result =
      await getCurrentUser(request);

    if ("error" in result) {
      return result.error;
    }

    const { user } = result;

    /*
    |--------------------------------------------------------------------------
    | REMOVE
    |--------------------------------------------------------------------------
    */

    user.avatar = null;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message:
          "Profile picture removed successfully.",
        data: {
          avatar: null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE_AVATAR_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to remove profile picture.",
      },
      { status: 500 }
    );
  }
}