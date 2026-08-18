import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

import connectDB from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import { verifyToken } from "@/lib/auth/jwt";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function authenticateAdmin(req: NextRequest) {
  const token = req.cookies.get("bookinglk_token")?.value;

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Administrator authentication required.",
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      success: false,
      status: 401,
      message: "Invalid or expired session.",
    };
  }

  if (
    payload.role !== "ADMIN" &&
    payload.role !== "SUPER_ADMIN"
  ) {
    return {
      success: false,
      status: 403,
      message: "Administrator access required.",
    };
  }

  return {
    success: true,
    status: 200,
    payload,
  };
}


  // GET SINGLE HOTEL


export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await authenticateAdmin(req);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel ID is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid hotel ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const hotel =
      await Hotel.findById(id).lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: hotel,
    });
  } catch (error) {
    console.error(
      "ADMIN_HOTEL_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load hotel.",
      },
      { status: 500 }
    );
  }
}


  // PATCH HOTEL


export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await authenticateAdmin(req);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel ID is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid hotel ID.",
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    await connectDB();

    const allowedFields = [
      "name",
      "slug",
      "description",
      "propertyType",
      "location",
      "coordinates",
      "rating",
      "reviewCount",
      "priceFrom",
      "currency",
      "amenities",
      "images",
      "isVerified",
      "isPublished",
      "ownerId",
    ] as const;

    const update: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        update[field] = body[field];
      }
    }

    /* -----------------------------------------
       NORMALIZE NAME
    ----------------------------------------- */

    if (
      update.name !== undefined &&
      typeof update.name === "string"
    ) {
      update.name = update.name.trim();
    }

    /* -----------------------------------------
       FIX SLUG
    ----------------------------------------- */

    if (
      update.slug !== undefined &&
      typeof update.slug === "string"
    ) {
      const normalizedSlug =
        update.slug.trim().toLowerCase();

      if (!normalizedSlug) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Hotel slug cannot be empty.",
          },
          { status: 400 }
        );
      }

      const duplicate =
        await Hotel.findOne({
          slug: normalizedSlug,
          _id: {
            $ne: id,
          },
        }).lean();

      if (duplicate) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Another hotel already uses this slug.",
          },
          { status: 409 }
        );
      }

      update.slug = normalizedSlug;
    }

    /* -----------------------------------------
       FIX DESCRIPTION
    ----------------------------------------- */

    if (
      update.description !== undefined &&
      typeof update.description === "string"
    ) {
      update.description =
        update.description.trim();
    }

    /* -----------------------------------------
       FIX PRICE
    ----------------------------------------- */

    if (update.priceFrom !== undefined) {
      const price = Number(update.priceFrom);

      if (!Number.isFinite(price) || price < 0) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Price must be a valid positive number.",
          },
          { status: 400 }
        );
      }

      update.priceFrom = price;
    }

    /* -----------------------------------------
       FIX RATING
    ----------------------------------------- */

    if (update.rating !== undefined) {
      const rating = Number(update.rating);

      if (
        !Number.isFinite(rating) ||
        rating < 0 ||
        rating > 5
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Rating must be between 0 and 5.",
          },
          { status: 400 }
        );
      }

      update.rating = rating;
    }

    /* -----------------------------------------
       FIX REVIEW COUNT
    ----------------------------------------- */

    if (update.reviewCount !== undefined) {
      const reviewCount =
        Number(update.reviewCount);

      if (
        !Number.isFinite(reviewCount) ||
        reviewCount < 0
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Review count must be a valid number.",
          },
          { status: 400 }
        );
      }

      update.reviewCount = reviewCount;
    }

    /* -----------------------------------------
       FIX AMENITIES
    ----------------------------------------- */

    if (update.amenities !== undefined) {
      if (!Array.isArray(update.amenities)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Amenities must be an array.",
          },
          { status: 400 }
        );
      }
    }

    /* -----------------------------------------
       FIX IMAGES
    ----------------------------------------- */

    if (update.images !== undefined) {
      if (!Array.isArray(update.images)) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Images must be an array.",
          },
          { status: 400 }
        );
      }
    }

    /* -----------------------------------------
       FIX COORDINATES
    ----------------------------------------- */

    if (update.coordinates !== undefined) {
      const coordinates =
        update.coordinates as {
          type?: string;
          coordinates?: unknown;
        };

      if (
        coordinates.type !== "Point" ||
        !Array.isArray(
          coordinates.coordinates
        ) ||
        coordinates.coordinates.length !== 2
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Coordinates must be a valid GeoJSON Point.",
          },
          { status: 400 }
        );
      }

      update.coordinates = {
        type: "Point",
        coordinates:
          coordinates.coordinates.map(Number),
      };
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No changes provided.",
        },
        { status: 400 }
      );
    }

    const hotel =
      await Hotel.findByIdAndUpdate(
        id,
        {
          $set: update,
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Hotel updated successfully.",
      data: hotel,
    });
  } catch (error) {
    console.error(
      "ADMIN_HOTEL_UPDATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update hotel.",
      },
      { status: 500 }
    );
  }
}


  // DELETE HOTEL


export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await authenticateAdmin(req);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        { status: auth.status }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel ID is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid hotel ID.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    const hotel =
      await Hotel.findByIdAndDelete(id);

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Hotel deleted successfully.",
    });
  } catch (error) {
    console.error(
      "ADMIN_HOTEL_DELETE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete hotel.",
      },
      { status: 500 }
    );
  }
}