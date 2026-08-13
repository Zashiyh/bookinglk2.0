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
    const propertyTypeParam = searchParams.get("propertyType");

    const minPrice = Number(
      searchParams.get("minPrice") || 0
    );

    const maxPriceParam = searchParams.get("maxPrice");

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

    /*
     * CITY
     */

    if (city && city.trim() !== "") {
      filter["location.city"] = {
        $regex: `^${escapeRegex(city.trim())}$`,
        $options: "i",
      };
    }

    /*
     * DISTRICT
     */

    if (district && district.trim() !== "") {
      filter["location.district"] = {
        $regex: `^${escapeRegex(district.trim())}$`,
        $options: "i",
      };
    }

    /*
     * =====================================================
     * PROPERTY TYPE
     *
     * Explore page sends:
     *
     * Hotel
     * Resort
     * Villa
     * Guest House
     * Apartment
     *
     * Database may contain:
     *
     * HOTEL
     * RESORT
     * VILLA
     * GUEST_HOUSE
     * APARTMENT
     *
     * So normalize before filtering.
     * =====================================================
     */

    if (
      propertyTypeParam &&
      propertyTypeParam !== "All"
    ) {
      const normalizedPropertyType =
        normalizePropertyType(
          propertyTypeParam
        );

      if (normalizedPropertyType) {
        filter.propertyType = {
          $in: [
            normalizedPropertyType,
            propertyTypeParam,
            propertyTypeParam.toUpperCase(),
          ],
        };
      }
    }

    /*
     * =====================================================
     * PRICE
     * =====================================================
     */

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

    /*
     * =====================================================
     * RATING
     * =====================================================
     */

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
          totalPages: Math.ceil(
            total / limit
          ),
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
        current +
          Number(room.totalRooms || 0)
      );
    }

    /*
     * =====================================================
     * ACTIVE BOOKINGS
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
     * BOOKED ROOM COUNT
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
     * BUILD RESPONSE
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

/*
 * =========================================================
 * PROPERTY TYPE NORMALIZER
 * =========================================================
 */

function normalizePropertyType(
  value: string
) {
  const normalized = value
    .trim()
    .toLowerCase()
    .replace(/[-\s]+/g, "_");

  const propertyTypeMap: Record<
    string,
    string
  > = {
    hotel: "HOTEL",

    resort: "RESORT",

    villa: "VILLA",

    "guest_house": "GUEST_HOUSE",

    guesthouse: "GUEST_HOUSE",

    apartment: "APARTMENT",
  };

  return (
    propertyTypeMap[normalized] ||
    value
      .trim()
      .toUpperCase()
      .replace(/[-\s]+/g, "_")
  );
}

/*
 * =========================================================
 * REGEX ESCAPE
 * =========================================================
 */

function escapeRegex(
  value: string
) {
  return value.replace(
    /[.*+?^${}()|[\]\\]/g,
    "\\$&"
  );
}