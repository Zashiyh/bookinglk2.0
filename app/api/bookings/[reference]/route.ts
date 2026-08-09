import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

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

// =====================================================
// GET BOOKING
// =====================================================

export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { reference } = await context.params;

    const value = decodeURIComponent(reference).trim();

    if (!value) {
      return NextResponse.json(
        {
          success: false,
          message: "Booking reference is required.",
        },
        { status: 400 }
      );
    }

    let booking = null;

    // -------------------------------------------------
    // FIND BY BOOKING REFERENCE
    // -------------------------------------------------

    booking = await Booking.findOne({
      bookingReference: value.toUpperCase(),
    }).lean();

    // -------------------------------------------------
    // FIND BY MONGODB OBJECT ID
    // -------------------------------------------------

    if (
      !booking &&
      mongoose.Types.ObjectId.isValid(value)
    ) {
      booking = await Booking.findById(value).lean();
    }

    // -------------------------------------------------
    // BOOKING NOT FOUND
    // -------------------------------------------------

    if (!booking) {
      console.log(
        "BOOKING NOT FOUND:",
        value
      );

      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    // -------------------------------------------------
    // GET HOTEL
    // -------------------------------------------------

    const hotel = await Hotel.findById(
      booking.hotelId
    ).lean();

    // -------------------------------------------------
    // GET ROOM
    // -------------------------------------------------

    const room = await Room.findById(
      booking.roomId
    ).lean();

    // -------------------------------------------------
    // RESPONSE
    // -------------------------------------------------

    return NextResponse.json(
      {
        success: true,

        data: {
          booking: {
            _id: booking._id.toString(),

            bookingReference:
              booking.bookingReference,

            checkIn:
              booking.checkIn,

            checkOut:
              booking.checkOut,

            guests:
              booking.guests,

            nights:
              booking.nights,

            guest: {
              firstName:
                booking.guest?.firstName || "",

              lastName:
                booking.guest?.lastName || "",

              email:
                booking.guest?.email || "",

              phone:
                booking.guest?.phone || "",
            },

            specialRequest:
              booking.specialRequest || "",

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
          },

          hotel: hotel
            ? {
                _id:
                  hotel._id.toString(),

                name:
                  hotel.name,

                slug:
                  hotel.slug,

                location:
                  hotel.location,

                images:
                  hotel.images || [],

                rating:
                  hotel.rating || 0,

                reviewCount:
                  hotel.reviewCount || 0,
              }
            : null,

          room: room
            ? {
                _id:
                  room._id.toString(),

                name:
                  room.name,

                roomType:
                  room.roomType,

                description:
                  room.description || "",

                pricePerNight:
                  room.pricePerNight,

                maxGuests:
                  room.maxGuests,

                beds:
                  room.beds || [],

                size:
                  room.size,

                amenities:
                  room.amenities || [],

                images:
                  room.images || [],
              }
            : null,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "GET BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to load booking.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// PATCH
// CONFIRM BOOKING + SEND EMAIL
// =====================================================

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { reference } =
      await context.params;

    const value =
      decodeURIComponent(reference).trim();

    if (!value) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Booking reference is required.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // FIND BOOKING
    // =================================================

    let booking = null;

    // First try booking reference
    booking = await Booking.findOne({
      bookingReference:
        value.toUpperCase(),
    });

    // If not found, try MongoDB ObjectId
    if (
      !booking &&
      mongoose.Types.ObjectId.isValid(value)
    ) {
      booking =
        await Booking.findById(value);
    }

    // =================================================
    // BOOKING NOT FOUND
    // =================================================

    if (!booking) {
      console.log(
        "CONFIRM BOOKING NOT FOUND:",
        value
      );

      return NextResponse.json(
        {
          success: false,
          message: "Booking not found.",
        },
        { status: 404 }
      );
    }

    console.log(
      "BOOKING FOUND:",
      booking._id.toString()
    );

    console.log(
      "BOOKING REFERENCE:",
      booking.bookingReference
    );

    // =================================================
    // CANCELLED CHECK
    // =================================================

    if (
      booking.status === "CANCELLED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This booking has been cancelled.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // ALREADY CONFIRMED
    // =================================================

    if (
      booking.status === "CONFIRMED"
    ) {
      console.log(
        "BOOKING ALREADY CONFIRMED:",
        booking.bookingReference
      );

      return NextResponse.json({
        success: true,

        message:
          "Booking is already confirmed.",

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
    }

    // =================================================
    // CONFIRM BOOKING
    // =================================================

    booking.status = "CONFIRMED";

    await booking.save();

    console.log(
      "BOOKING CONFIRMED:",
      booking.bookingReference
    );

    // =================================================
    // GET HOTEL
    // =================================================

    const hotel =
      await Hotel.findById(
        booking.hotelId
      ).lean();

    // =================================================
    // GET ROOM
    // =================================================

    const room =
      await Room.findById(
        booking.roomId
      ).lean();

    // =================================================
    // GET GUEST EMAIL
    // =================================================

    const guestEmail =
      booking.guest?.email?.trim() || "";

    // =================================================
    // NO EMAIL
    // =================================================

    if (!guestEmail) {
      console.error(
        "BOOKING EMAIL ERROR: Guest email is missing."
      );

      return NextResponse.json({
        success: true,

        message:
          "Booking confirmed, but confirmation email could not be sent because guest email is missing.",

        data: {
          _id:
            booking._id.toString(),

          bookingReference:
            booking.bookingReference,

          status:
            booking.status,

          paymentStatus:
            booking.paymentStatus,

          guestEmail: "",
        },
      });
    }

    // =================================================
    // SEND EMAIL
    // =================================================

    try {
      console.log(
        "================================="
      );

      console.log(
        "SENDING BOOKING CONFIRMATION EMAIL"
      );

      console.log(
        "TO:",
        guestEmail
      );

      console.log(
        "REFERENCE:",
        booking.bookingReference
      );

      console.log(
        "================================="
      );

      await sendBookingConfirmationEmail({
        bookingReference:
          booking.bookingReference,

        guestName:
          `${booking.guest?.firstName || ""} ${
            booking.guest?.lastName || ""
          }`.trim(),

        guestEmail:
          guestEmail,

        hotelName:
          hotel?.name ||
          "BookingLK Hotel",

        roomName:
          room?.name ||
          "Selected Room",

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
        "================================="
      );

      console.log(
        "BOOKING EMAIL SENT SUCCESSFULLY"
      );

      console.log(
        "TO:",
        guestEmail
      );

      console.log(
        "================================="
      );

    } catch (emailError) {
      console.error(
        "================================="
      );

      console.error(
        "BOOKING EMAIL FAILED"
      );

      console.error(
        emailError
      );

      console.error(
        "================================="
      );

      // Booking remains confirmed.
      return NextResponse.json({
        success: true,

        message:
          "Booking confirmed, but confirmation email could not be sent.",

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
            guestEmail,
        },
      });
    }

    // =================================================
    // FINAL SUCCESS
    // =================================================

    return NextResponse.json({
      success: true,

      message:
        "Booking confirmed and confirmation email sent successfully.",

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
          guestEmail,
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