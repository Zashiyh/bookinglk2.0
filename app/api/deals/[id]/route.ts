import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import { Deal } from "@/models/Deal";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal ID.",
        },
        {
          status: 400,
        }
      );
    }

    const deal = await Deal.findOne({
      _id: id,
      isPublished: true,
    })
      .populate({
        path: "hotelId",
        select:
          "name slug description location rating reviewCount priceFrom currency amenities images isVerified",
      })
      .lean();

    if (!deal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(
      {
        success: true,
        deal,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET DEAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load deal.",
      },
      {
        status: 500,
      }
    );
  }
}