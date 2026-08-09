import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import connectDB from "@/lib/db/mongoose";
import { Booking } from "@/models/Booking";
import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";

interface RouteContext {
  params: Promise<{
    reference: string;
  }>;
}

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

    /*
     * First try booking reference
     *
     * Example:
     * BLK-123456-ABC123
     */
    booking = await Booking.findOne({
      bookingReference: value.toUpperCase(),
    }).lean();

    /*
     * If not found, try MongoDB ObjectId
     *
     * Example:
     * 6a7815678b32156b6c5a99e8
     */
    if (
      !booking &&
      mongoose.Types.ObjectId.isValid(value)
    ) {
      booking = await Booking.findById(
        value
      ).lean();
    }

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

    /*
     * Get hotel
     */
    const hotel = await Hotel.findById(
      booking.hotelId
    ).lean();

    /*
     * Get room
     */
    const room = await Room.findById(
      booking.roomId
    ).lean();

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
                booking.guest?.firstName ||
                "",

              lastName:
                booking.guest?.lastName ||
                "",

              email:
                booking.guest?.email ||
                "",

              phone:
                booking.guest?.phone ||
                "",
            },

            specialRequest:
              booking.specialRequest ||
              "",

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