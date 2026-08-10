import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { User } from "@/models/User";
import { Hotel } from "@/models/Hotel";
import { Booking } from "@/models/Booking";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("bookinglk_token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator authentication required.",
        },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired administrator session.",
        },
        { status: 401 }
      );
    }

    if (
      payload.role !== "ADMIN" &&
      payload.role !== "SUPER_ADMIN"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Administrator access required.",
        },
        { status: 403 }
      );
    }

    await connectDB();

    const [
      totalUsers,
      totalHotels,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      revenueResult,
      recentBookings,
    ] = await Promise.all([
      User.countDocuments(),

      Hotel.countDocuments(),

      Booking.countDocuments(),

      Booking.countDocuments({
        status: "PENDING",
      }),

      Booking.countDocuments({
        status: "CONFIRMED",
      }),

      Booking.countDocuments({
        status: "CANCELLED",
      }),

      Booking.aggregate([
        {
          $match: {
            paymentStatus: "PAID",
            status: {
              $ne: "CANCELLED",
            },
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
      ]),

      Booking.find()
        .sort({
          createdAt: -1,
        })
        .limit(8)
        .select(
          "bookingReference guest hotelId checkIn checkOut total currency status paymentStatus createdAt"
        )
        .populate(
          "hotelId",
          "name location.city"
        )
        .lean(),
    ]);

    const revenue =
      revenueResult.length > 0
        ? Number(revenueResult[0].total || 0)
        : 0;

    return NextResponse.json({
      success: true,

      data: {
        stats: {
          totalUsers,
          totalHotels,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          revenue,
        },

        recentBookings,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_DASHBOARD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load dashboard data.",
      },
      { status: 500 }
    );
  }
}