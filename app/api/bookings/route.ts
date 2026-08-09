import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { Booking } from "@/models/Booking";
import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";
import connectDB from "@/lib/db/mongoose";

function generateBookingReference(): string {
  const random = Math.random()
    .toString(36)
    .substring(2, 8)
    .toUpperCase();

  return `BLK-${Date.now()
    .toString()
    .slice(-6)}-${random}`;
}

function calculateNights(
  checkIn: Date,
  checkOut: Date
): number {
  const difference =
    checkOut.getTime() -
    checkIn.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    const body = await request.json();

    const {
      hotelId,
      roomId,
      checkIn,
      checkOut,
      guests,
      guest,
      specialRequest,
    } = body;

    // --------------------------------
    // Required fields
    // --------------------------------

    if (
      !hotelId ||
      !roomId ||
      !checkIn ||
      !checkOut ||
      guests === undefined ||
      guests === null ||
      !guest
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Required booking information is missing.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Validate MongoDB IDs
    // --------------------------------

    if (
      !mongoose.Types.ObjectId.isValid(
        hotelId
      ) ||
      !mongoose.Types.ObjectId.isValid(
        roomId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid hotel or room ID.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Dates
    // --------------------------------

    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);

    if (
      Number.isNaN(
        startDate.getTime()
      ) ||
      Number.isNaN(
        endDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid booking dates.",
        },
        { status: 400 }
      );
    }

    const nights =
      calculateNights(
        startDate,
        endDate
      );

    if (nights <= 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Check-out must be after check-in.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Prevent past check-in
    // --------------------------------

    const today = new Date();

    today.setHours(
      0,
      0,
      0,
      0
    );

    if (startDate < today) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Check-in date cannot be in the past.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Find published hotel
    // --------------------------------

    const hotel =
      await Hotel.findOne({
        _id: hotelId,
        isPublished: true,
      }).lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hotel not found or unavailable.",
        },
        { status: 404 }
      );
    }

    // --------------------------------
    // Find active room
    // --------------------------------

    const room =
      await Room.findOne({
        _id: roomId,
        hotelId:
          new mongoose.Types.ObjectId(
            hotelId
          ),
        isActive: true,
      }).lean();

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected room is not available.",
        },
        { status: 404 }
      );
    }

    // --------------------------------
    // Validate guest count
    // --------------------------------

    const guestCount =
      Number(guests);

    if (
      !Number.isInteger(
        guestCount
      ) ||
      guestCount <= 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid guest count.",
        },
        { status: 400 }
      );
    }

    if (
      guestCount >
      room.maxGuests
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `This room allows a maximum of ${room.maxGuests} guests.`,
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Guest details
    // --------------------------------

    const firstName =
      String(
        guest.firstName ?? ""
      ).trim();

    const lastName =
      String(
        guest.lastName ?? ""
      ).trim();

    const email =
      String(
        guest.email ?? ""
      )
        .trim()
        .toLowerCase();

    const phone =
      String(
        guest.phone ?? ""
      ).trim();

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Guest information is incomplete.",
        },
        { status: 400 }
      );
    }

    // --------------------------------
    // Check room availability
    // --------------------------------

    const overlappingBookings =
      await Booking.countDocuments({
        roomId:
          new mongoose.Types.ObjectId(
            roomId
          ),

        status: {
          $in: [
            "PENDING",
            "CONFIRMED",
          ],
        },

        checkIn: {
          $lt: endDate,
        },

        checkOut: {
          $gt: startDate,
        },
      });

    if (
      overlappingBookings >=
      room.totalRooms
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This room is not available for the selected dates.",
        },
        { status: 409 }
      );
    }

    // --------------------------------
    // Calculate price
    // --------------------------------

    const roomTotal =
      room.pricePerNight *
      nights;

    const serviceFee =
      Math.round(
        roomTotal * 0.05
      );

    const total =
      roomTotal +
      serviceFee;

    // --------------------------------
    // Create booking
    // --------------------------------

    const booking =
      await Booking.create({
        bookingReference:
          generateBookingReference(),

        hotelId:
          new mongoose.Types.ObjectId(
            hotelId
          ),

        roomId:
          new mongoose.Types.ObjectId(
            roomId
          ),

        checkIn: startDate,

        checkOut: endDate,

        guests: guestCount,

        guest: {
          firstName,
          lastName,
          email,
          phone,
        },

        specialRequest:
          String(
            specialRequest ?? ""
          ).trim(),

        nights,

        roomPrice:
          room.pricePerNight,

        roomTotal,

        serviceFee,

        total,

        currency: "LKR",

        status: "PENDING",

        paymentStatus: "PENDING",
      });

    // --------------------------------
    // Response
    // --------------------------------

    return NextResponse.json(
      {
        success: true,

        message:
          "Booking created successfully.",

        data: {
          _id:
            booking._id.toString(),

          bookingReference:
            booking.bookingReference,

          hotelId:
            booking.hotelId.toString(),

          roomId:
            booking.roomId.toString(),

          checkIn:
            booking.checkIn,

          checkOut:
            booking.checkOut,

          guests:
            booking.guests,

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
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE BOOKING ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create booking.",
      },
      { status: 500 }
    );
  }
}