import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import User from "@/models/User";
import Hotel from "@/models/Hotel";
import Booking from "@/models/Booking";
import { verifyToken } from "@/lib/auth/jwt";

export async function GET(req: NextRequest) {
  try {

    // AUTHENTICATION


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
          message: "Invalid or expired session.",
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


    // DATABASE


    await connectDB();


    // USERS


    const [
      totalUsers,
      totalAdmins,
      totalHotels,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
    ] = await Promise.all([
      User.countDocuments({
        role: "USER",
      }),

      User.countDocuments({
        role: {
          $in: ["ADMIN", "SUPER_ADMIN"],
        },
      }),

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
    ]);


    // REVENUE
    //
    // Revenue = PAID bookings
    // excluding cancelled bookings


    const revenueResult = await Booking.aggregate([
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
            $sum: {
              $ifNull: ["$total", 0],
            },
          },
        },
      },
    ]);

    const revenue = Number(
      revenueResult[0]?.total ?? 0
    );


    // RECENT BOOKINGS


    const recentBookings = await Booking.find({})
      .sort({
        createdAt: -1,
      })
      .limit(8)
      .populate({
        path: "hotelId",
        select: "name location",
      })
      .lean();


    // NORMALIZE RECENT BOOKINGS


    const normalizedRecentBookings =
      recentBookings.map((booking: any) => ({
        _id: String(booking._id),

        bookingReference:
          booking.bookingReference ?? "N/A",

        guest: {
          firstName:
            booking.guest?.firstName ?? "",

          lastName:
            booking.guest?.lastName ?? "",

          email:
            booking.guest?.email ?? "",
        },

        hotelId: booking.hotelId
          ? {
              _id: String(
                booking.hotelId._id
              ),

              name:
                booking.hotelId.name ??
                "Unknown hotel",

              location: {
                city:
                  booking.hotelId.location
                    ?.city ?? "",
              },
            }
          : undefined,

        checkIn: booking.checkIn
          ? new Date(
              booking.checkIn
            ).toISOString()
          : "",

        checkOut: booking.checkOut
          ? new Date(
              booking.checkOut
            ).toISOString()
          : "",

        total: Number(
          booking.total ?? 0
        ),

        currency:
          booking.currency ?? "LKR",

        status:
          booking.status ?? "PENDING",

        paymentStatus:
          booking.paymentStatus ??
          "PENDING",

        createdAt: booking.createdAt
          ? new Date(
              booking.createdAt
            ).toISOString()
          : "",
      }));


    // RESPONSE
    //
    // IMPORTANT:
    // This shape matches page.tsx exactly.


    return NextResponse.json({
      success: true,

      data: {
        stats: {
          totalUsers,
          totalAdmins,
          totalHotels,
          totalBookings,
          pendingBookings,
          confirmedBookings,
          cancelledBookings,
          revenue,
        },

        recentBookings:
          normalizedRecentBookings,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_STATS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load dashboard statistics.",
      },
      { status: 500 }
    );
  }
}