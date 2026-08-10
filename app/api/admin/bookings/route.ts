import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
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

    const { searchParams } = new URL(req.url);

    const page = Math.max(
      Number(searchParams.get("page")) || 1,
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit")) || 10,
        1
      ),
      100
    );

    const search =
      searchParams.get("search")?.trim() || "";

    const status =
      searchParams.get("status")?.trim() || "ALL";

    const filter: Record<string, unknown> = {};

    if (status !== "ALL") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        {
          bookingReference: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "guest.firstName": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "guest.lastName": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "guest.email": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    const skip = (page - 1) * limit;

    const [bookings, total] =
      await Promise.all([
        Booking.find(filter)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),

        Booking.countDocuments(filter),
      ]);

    const totalPages =
      Math.ceil(total / limit);

    return NextResponse.json({
      success: true,

      data: bookings.map((booking) => ({
        id: String(booking._id),

        bookingReference:
          booking.bookingReference,

        hotelId:
          String(booking.hotelId),

        roomId:
          String(booking.roomId),

        checkIn:
          booking.checkIn,

        checkOut:
          booking.checkOut,

        guests:
          booking.guests,

        guest: {
          firstName:
            booking.guest.firstName,

          lastName:
            booking.guest.lastName,

          email:
            booking.guest.email,

          phone:
            booking.guest.phone,
        },

        specialRequest:
          booking.specialRequest ?? "",

        nights:
          booking.nights,

        roomPrice:
          booking.roomPrice,

        roomTotal:
          booking.roomTotal,

        serviceFee:
          booking.serviceFee,

        total:
          booking.total,

        currency:
          booking.currency,

        status:
          booking.status,

        paymentStatus:
          booking.paymentStatus,

        createdAt:
          booking.createdAt,

        updatedAt:
          booking.updatedAt,
      })),

      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage:
          page < totalPages,
        hasPreviousPage:
          page > 1,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_BOOKINGS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to load bookings.",
      },
      { status: 500 }
    );
  }
}