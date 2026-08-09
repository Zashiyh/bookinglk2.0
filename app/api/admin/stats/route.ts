import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { Hotel } from "@/models/Hotel";
import { Booking } from "@/models/Booking";
import { getAdminFromRequest } from "@/lib/auth/admin";

export async function GET(req: NextRequest) {
  try {
    const admin = getAdminFromRequest(req);

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Admin access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const [
      totalUsers,
      totalAdmins,
      totalHotels,
      totalBookings,
    ] = await Promise.all([
      User.countDocuments({ role: "USER" }),
      User.countDocuments({ role: "ADMIN" }),
      Hotel.countDocuments(),
      Booking.countDocuments(),
    ]);

    const confirmedBookings =
      await Booking.countDocuments({
        status: "CONFIRMED",
      });

    const cancelledBookings =
      await Booking.countDocuments({
        status: "CANCELLED",
      });

    const revenueResult = await Booking.aggregate([
      {
        $match: {
          status: "CONFIRMED",
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$total",
          },
        },
      },
    ]);

    const revenue =
      revenueResult.length > 0
        ? revenueResult[0].total
        : 0;

    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalAdmins,
        totalHotels,
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        revenue,
      },
    });
  } catch (error) {
    console.error("ADMIN_STATS_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load admin statistics.",
      },
      { status: 500 }
    );
  }
}