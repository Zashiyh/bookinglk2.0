import { NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { Deal } from "@/models/Deal";

export async function GET() {
  try {
    await connectDB();

    const now = new Date();

    const deals = await Deal.find({
      isPublished: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .populate({
        path: "hotelId",
        select: "name slug location images",
      })
      .sort({
        isFeatured: -1,
        createdAt: -1,
      })
      .lean();

    return NextResponse.json(
      {
        success: true,
        deals,
        data: deals,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error("GET PUBLIC DEALS ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load deals.",
      },
      {
        status: 500,
      }
    );
  }
}