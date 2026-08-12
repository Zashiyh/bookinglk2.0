import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import { Room } from "@/models/Room";
import Booking from "@/models/Booking";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const city = searchParams.get("city");
    const district = searchParams.get("district");
    const propertyType = searchParams.get("propertyType");

    const minPrice = Number(
      searchParams.get("minPrice") || 0
    );

    const maxPriceParam =
      searchParams.get("maxPrice");

    const minRating = Number(
      searchParams.get("rating") || 0
    );

    const page = Math.max(
      Number(searchParams.get("page") || 1),
      1
    );

    const limit = Math.min(
      Math.max(
        Number(searchParams.get("limit") || 12),
        1
      ),
      50
    );

    const skip = (page - 1) * limit;

    /*
     * =====================================================
     * HOTEL FILTER
     * =====================================================
     */

    const filter: Record<string, unknown> = {
      isPublished: true,
    };

    if (city) {
      filter["location.city"] = {
        $regex: city,
        $options: "i",
      };
    }

    if (district) {
      filter["location.district"] = {
        $regex: district,
        $options: "i",
      };
    }

    if (propertyType) {
      filter.propertyType = propertyType;
    }

    if (minPrice > 0 || maxPriceParam) {
      filter.priceFrom = {
        $gte: minPrice,
        ...(maxPriceParam
          ? {
              $lte: Number(maxPriceParam),
            }
          : {}),
      };
    }

    if (minRating > 0) {
      filter.rating = {
        $gte: minRating,
      };
    }

    /*
     * =====================================================
     * GET HOTELS
     * =====================================================
     */

    const [hotels, total] = await Promise.all([
      Hotel.find(filter)
        .sort({
          rating: -1,
          reviewCount: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean(),

      Hotel.countDocuments(filter),
    ]);

    /*
     * =====================================================
     * NO HOTELS
     * =====================================================
     */

    if (hotels.length === 0) {
      return NextResponse.json({
        success: true,
        data: [],
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    /*
     * =====================================================
     * HOTEL IDS
     * =====================================================
     */

    const hotelIds = hotels.map(
      (hotel) => hotel._id
    );

    /*
     * =====================================================
     * GET ACTIVE ROOMS
     *
     * totalRooms = actual physical rooms
     * belonging to each room type.
     * =====================================================
     */

    const rooms = await Room.find({
      hotelId: {
        $in: hotelIds,
      },
      isActive: true,
    })
      .select(
        "_id hotelId totalRooms"
      )
      .lean();

    /*
     * =====================================================
     * TOTAL ROOM COUNT PER HOTEL
     * =====================================================
     */

    const totalRoomMap = new Map<
      string,
      number
    >();

    for (const room of rooms) {
      const hotelId =
        room.hotelId.toString();

      const current =
        totalRoomMap.get(hotelId) || 0;

      totalRoomMap.set(
        hotelId,
        current + room.totalRooms
      );
    }

    /*
     * =====================================================
     * FIND ACTIVE BOOKINGS
     *
     * We count:
     *
     * PENDING
     * CONFIRMED
     * COMPLETED
     *
     * Cancelled bookings are NOT counted.
     *
     * Refunded bookings are NOT counted.
     * Failed payments are NOT counted.
     *
     * Since the hotel card doesn't receive
     * check-in/check-out dates yet, we use
     * bookings that are currently active.
     * =====================================================
     */

    const now = new Date();

    const activeBookings =
      await Booking.find({
        hotelId: {
          $in: hotelIds,
        },

        status: {
          $in: [
            "PENDING",
            "CONFIRMED",
          ],
        },

        paymentStatus: {
          $nin: [
            "FAILED",
            "REFUNDED",
          ],
        },

        checkIn: {
          $lte: now,
        },

        checkOut: {
          $gt: now,
        },
      })
        .select(
          "hotelId roomId"
        )
        .lean();

    /*
     * =====================================================
     * BOOKED ROOM COUNT PER HOTEL
     * =====================================================
     *
     * Every booking represents ONE booked room
     * because Booking model doesn't have quantity.
     *
     * =====================================================
     */

    const bookedRoomMap = new Map<
      string,
      number
    >();

    for (const booking of activeBookings) {
      const hotelId =
        booking.hotelId.toString();

      const current =
        bookedRoomMap.get(hotelId) || 0;

      bookedRoomMap.set(
        hotelId,
        current + 1
      );
    }

    /*
     * =====================================================
     * BUILD HOTEL RESPONSE
     * =====================================================
     */

    const hotelsWithAvailability =
      hotels.map((hotel) => {
        const hotelId =
          hotel._id.toString();

        const totalRooms =
          totalRoomMap.get(hotelId) || 0;

        const bookedRooms =
          bookedRoomMap.get(hotelId) || 0;

        const availableRooms =
          Math.max(
            totalRooms - bookedRooms,
            0
          );

        return {
          ...hotel,

          /*
           * Availability information
           */

          totalRooms,

          bookedRooms,

          availableRooms,

          hasAvailableRooms:
            availableRooms > 0,
        };
      });

    /*
     * =====================================================
     * RESPONSE
     * =====================================================
     */

    return NextResponse.json({
      success: true,

      data: hotelsWithAvailability,

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    console.error(
      "GET /api/hotels error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to fetch hotels",
      },
      {
        status: 500,
      }
    );
  }
}