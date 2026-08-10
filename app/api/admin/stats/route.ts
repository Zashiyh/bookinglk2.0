import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import  { User  }   from "@/models/User";
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

    await connectDB();

    /*
     * USERS
     */
    const totalUsers = await User.countDocuments({
      role: "USER",
    });

    const totalAdmins = await User.countDocuments({
      role: {
        $in: ["ADMIN", "SUPER_ADMIN"],
      },
    });

    /*
     * Optional models
     *
     * These are loaded dynamically so the dashboard
     * won't crash before Hotel / Booking models exist.
     */

    let totalHotels = 0;
    let totalBookings = 0;
    let confirmedBookings = 0;
    let pendingBookings = 0;
    let cancelledBookings = 0;
    let totalRevenue = 0;

    try {
      const { default: Hotel } = await import(
        "@/models/Hotel"
      );

      totalHotels = await Hotel.countDocuments();
    } catch {
      totalHotels = 0;
    }

    try {
      const { default: Booking } = await import(
        "@/models/Booking"
      );

      totalBookings = await Booking.countDocuments();

      confirmedBookings =
        await Booking.countDocuments({
          status: "CONFIRMED",
        });

      pendingBookings =
        await Booking.countDocuments({
          status: "PENDING",
        });

      cancelledBookings =
        await Booking.countDocuments({
          status: "CANCELLED",
        });

      const revenueResult =
        await Booking.aggregate([
          {
            $match: {
              status: "CONFIRMED",
            },
          },
          {
            $group: {
              _id: null,
              total: {
                $sum: {
                  $ifNull: [
                    "$totalAmount",
                    0,
                  ],
                },
              },
            },
          },
        ]);

      totalRevenue =
        revenueResult[0]?.total ?? 0;
    } catch {
      /*
       * Booking model may not exist yet.
       */
    }

    return NextResponse.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
        },

        admins: {
          total: totalAdmins,
        },

        hotels: {
          total: totalHotels,
        },

        bookings: {
          total: totalBookings,
          confirmed: confirmedBookings,
          pending: pendingBookings,
          cancelled: cancelledBookings,
        },

        revenue: {
          total: totalRevenue,
          currency: "LKR",
        },
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