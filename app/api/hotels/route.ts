import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } =
      new URL(request.url);

    const city = searchParams.get("city");
    const district = searchParams.get("district");
    const propertyType =
      searchParams.get("propertyType");

    const minPrice = Number(
      searchParams.get("minPrice") || 0
    );

    const maxPriceParam =
      searchParams.get("maxPrice");

    const minRating = Number(
      searchParams.get("rating") || 0
    );

    const page = Math.max(
      Number(searchParams.get("page") || 1),
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit") || 12),
        1
      ),
      50
    );

    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {
      isPublished: true,
    };

    if (city) {
      filter["location.city"] = {
        $regex: city,
        $options: "i",
      };
    }

    if (district) {
      filter["location.district"] = {
        $regex: district,
        $options: "i",
      };
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice > 0 || maxPriceParam) {
      filter.priceFrom = {
        $gte: minPrice,
        ...(maxPriceParam
          ? {
              $lte: Number(maxPriceParam),
            }
          : {}),
      };
    }

    if (minRating > 0) {
      filter.rating = {
        $gte: minRating,
      };
    }

    const [hotels, total] =
      await Promise.all([
        Hotel.find(filter)
          .sort({
            rating: -1,
            reviewCount: -1,
          })
          .skip(skip)
          .limit(limit)
          .lean(),

        Hotel.countDocuments(filter),
      ]);

    return NextResponse.json({
      success: true,

      data: hotels,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/hotels error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch hotels",
      },
      {
        status: 500,
      }
    );
  }
}