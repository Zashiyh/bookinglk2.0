import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";

import "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";

export async function GET(
  _request: NextRequest,
  context: {
    params: Promise<{ slug: string }>;
  }
) {
  try {
    
    if (mongoose.connection.readyState !== 1) {
      return NextResponse.json(
        {
          success: false,
          message: "Database connection is not ready",
        },
        { status: 503 }
      );
    }

    const { slug } = await context.params;

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel slug is required",
        },
        { status: 400 }
      );
    }

    const hotel = await Hotel.findOne({
      slug: slug.toLowerCase(),
      isPublished: true,
    }).lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel not found",
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
      "GET /api/hotels/[slug] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch hotel",
      },
      { status: 500 }
    );
  }
}