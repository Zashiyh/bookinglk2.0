
import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

import connectDB from "@/lib/db/mongoose";

import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";
import { Booking } from "@/models/Booking";

import { verifyToken } from "@/lib/auth/jwt";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

async function authenticateAdmin(req: NextRequest) {
  const token = req.cookies.get("bookinglk_token")?.value;

  if (!token) {
    return {
      success: false,
      status: 401,
      message: "Administrator authentication required.",
    };
  }

  const payload = verifyToken(token);

  if (!payload) {
    return {
      success: false,
      status: 401,
      message: "Invalid or expired session.",
    };
  }

  if (
    payload.role !== "ADMIN" &&
    payload.role !== "SUPER_ADMIN"
  ) {
    return {
      success: false,
      status: 403,
      message: "Administrator access required.",
    };
  }

  return {
    success: true,
    status: 200,
    payload,
  };
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await authenticateAdmin(req);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid booking ID: ${id}`,
        },
        { status: 400 }
      );
    }

    await connectDB();

    /*
     * Make sure the referenced models are registered
     * before mongoose populate() is executed.
     */
    void Hotel;
    void Room;
    void Booking;

    const booking = await Booking.findById(id)
      .populate({
        path: "hotelId",
        model: Hotel,
        select: "name slug location images",
      })
      .populate({
        path: "roomId",
        model: Room,
        select:
          "name description roomType pricePerNight currency maxGuests beds size amenities images totalRooms isActive",
      })
      .lean();

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: booking,
    });
  } catch (error) {
    console.error(
      "ADMIN_BOOKING_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load booking.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  try {
    const auth = await authenticateAdmin(req);

    if (!auth.success) {
      return NextResponse.json(
        {
          success: false,
          message: auth.message,
        },
        {
          status: auth.status,
        }
      );
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking ID is required.",
        },
        { status: 400 }
      );
    }

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid booking ID: ${id}`,
        },
        { status: 400 }
      );
    }

    const body = await req.json();

    const status = body.status;
    const paymentStatus = body.paymentStatus;

    const validStatuses = [
      "PENDING",
      "CONFIRMED",
      "CANCELLED",
      "COMPLETED",
    ];

    const validPaymentStatuses = [
      "PENDING",
      "PAID",
      "FAILED",
      "REFUNDED",
    ];

    if (
      status !== undefined &&
      !validStatuses.includes(status)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid booking status.",
        },
        { status: 400 }
      );
    }

    if (
      paymentStatus !== undefined &&
      !validPaymentStatuses.includes(
        paymentStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid payment status.",
        },
        { status: 400 }
      );
    }

    const update: Record<string, string> = {};

    if (status !== undefined) {
      update.status = status;
    }

    if (paymentStatus !== undefined) {
      update.paymentStatus = paymentStatus;
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No changes provided.",
        },
        { status: 400 }
      );
    }

    await connectDB();

    /*
     * Make sure the referenced models are registered
     * before mongoose populate() is executed.
     */
    void Hotel;
    void Room;
    void Booking;

    const booking =
      await Booking.findByIdAndUpdate(
        id,
        {
          $set: update,
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate({
          path: "hotelId",
          model: Hotel,
          select: "name slug location images",
        })
        .populate({
          path: "roomId",
          model: Room,
          select:
            "name description roomType pricePerNight currency maxGuests beds size amenities images totalRooms isActive",
        })
        .lean();

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Booking updated successfully.",
      data: booking,
    });
  } catch (error) {
    console.error(
      "ADMIN_BOOKING_UPDATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update booking.",
      },
      { status: 500 }
    );
  }
}

