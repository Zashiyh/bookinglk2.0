
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";
import { sendBookingConfirmationEmail } from "@/lib/email/sendBookingConfirmation";

interface RouteContext {
  params: Promise<{
    reference: string;
  }>;
}

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { reference } = await context.params;

    const value = decodeURIComponent(reference)
      .trim()
      .toUpperCase();

    if (!value) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking reference is required.",
        },
        { status: 400 }
      );
    }

    const booking = await Booking.findOne({
      bookingReference: value,
    });

    if (!booking) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    if (booking.status === "CANCELLED") {
      return NextResponse.json(
        {
          success: false,
          message: "This booking has been cancelled.",
        },
        { status: 400 }
      );
    }

    /*
     * If already confirmed, don't send another email.
     */
    if (booking.status === "CONFIRMED") {
      return NextResponse.json({
        success: true,
        message: "Booking is already confirmed.",
        data: {
          _id: booking._id.toString(),
          bookingReference:
            booking.bookingReference,
          status: booking.status,
          paymentStatus:
            booking.paymentStatus,
          guestEmail:
            booking.guest?.email || "",
        },
      });
    }

    /*
     * Get hotel details
     */
    const hotel = await Hotel.findById(
      booking.hotelId
    ).lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hotel information could not be found.",
        },
        { status: 404 }
      );
    }

    /*
     * Get room details
     */
    const room = await Room.findById(
      booking.roomId
    ).lean();

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Room information could not be found.",
        },
        { status: 404 }
      );
    }

    /*
     * Confirm booking
     */
    booking.status = "CONFIRMED";

    await booking.save();

    /*
     * Send confirmation email
     */
    try {
      await sendBookingConfirmationEmail({
        bookingReference:
          booking.bookingReference,

        guestName:
          `${booking.guest?.firstName || ""} ${
            booking.guest?.lastName || ""
          }`.trim(),

        guestEmail:
          booking.guest?.email || "",

        hotelName:
          hotel.name,

        roomName:
          room.name,

        checkIn:
          booking.checkIn,

        checkOut:
          booking.checkOut,

        guests:
          booking.guests,

        nights:
          booking.nights,

        roomTotal:
          booking.roomTotal,

        serviceFee:
          booking.serviceFee,

        total:
          booking.total,

        currency:
          booking.currency,
      });

      console.log(
        "BOOKING CONFIRMATION EMAIL SENT:",
        booking.guest?.email
      );
    } catch (emailError) {
      /*
       * Booking is already confirmed.
       * Email failure should not undo the booking.
       */
      console.error(
        "BOOKING EMAIL ERROR:",
        emailError
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Booking confirmed successfully.",
      data: {
        _id:
          booking._id.toString(),

        bookingReference:
          booking.bookingReference,

        status:
          booking.status,

        paymentStatus:
          booking.paymentStatus,

        guestEmail:
          booking.guest?.email || "",
      },
    });
  } catch (error) {
    console.error(
      "CONFIRM BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to confirm booking.",
      },
      { status: 500 }
    );
  }
}
