import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";

import "@/lib/db/mongoose";

import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";

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
    }).select("_id");

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel not found",
        },
        { status: 404 }
      );
    }

    const rooms = await Room.find({
      hotelId: hotel._id,
      isActive: true,
    })
      .sort({
        pricePerNight: 1,
      })
      .lean();

    return NextResponse.json({
      success: true,
      data: rooms,
      total: rooms.length,
    });
  } catch (error) {
    console.error(
      "GET /api/hotels/[slug]/rooms error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch rooms",
      },
      { status: 500 }
    );
  }
}