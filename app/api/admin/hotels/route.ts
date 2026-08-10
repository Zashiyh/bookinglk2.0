
import { NextRequest, NextResponse } from "next/server";

import connectDB from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import { verifyToken } from "@/lib/auth/jwt";

/* =========================================================
   TYPES
   ========================================================= */

type PropertyType =
  | "HOTEL"
  | "RESORT"
  | "VILLA"
  | "APARTMENT"
  | "GUEST_HOUSE"
  | "BOUTIQUE_HOTEL"
  | "HOSTEL"
  | "HOMESTAY";

type CreateHotelBody = {
  name?: string;
  slug?: string;
  description?: string;

  propertyType?: PropertyType;

  location?: {
    address?: string;
    city?: string;
    district?: string;
    province?: string;
    country?: string;
  };

  coordinates?: {
    type?: string;
    coordinates?: number[];
  };

  rating?: number | string;
  reviewCount?: number | string;
  priceFrom?: number | string;

  currency?: string;

  amenities?: string[];
  images?: string[];

  isVerified?: boolean;
  isPublished?: boolean;
};

/* =========================================================
   ADMIN AUTHENTICATION
   ========================================================= */

async function authenticateAdmin(
  req: NextRequest
) {
  const token =
    req.cookies.get(
      "bookinglk_token"
    )?.value;

  if (!token) {
    return {
      success: false as const,
      status: 401,
      message:
        "Administrator authentication required.",
    };
  }

  const payload =
    verifyToken(token);

  if (!payload) {
    return {
      success: false as const,
      status: 401,
      message:
        "Invalid or expired session.",
    };
  }

  if (
    payload.role !== "ADMIN" &&
    payload.role !== "SUPER_ADMIN"
  ) {
    return {
      success: false as const,
      status: 403,
      message:
        "Administrator access required.",
    };
  }

  return {
    success: true as const,
    status: 200,
    payload,
  };
}

/* =========================================================
   GET - ADMIN HOTELS
   ========================================================= */

export async function GET(
  req: NextRequest
) {
  try {
    const auth =
      await authenticateAdmin(req);

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

    await connectDB();

    const { searchParams } =
      new URL(req.url);

    const page = Math.max(
      1,
      Number(
        searchParams.get("page")
      ) || 1
    );

    const limit = Math.min(
      50,
      Math.max(
        1,
        Number(
          searchParams.get("limit")
        ) || 10
      )
    );

    const search =
      searchParams
        .get("search")
        ?.trim() || "";

    const propertyType =
      searchParams
        .get("propertyType")
        ?.trim() || "";

    const published =
      searchParams.get(
        "published"
      );

    const verified =
      searchParams.get(
        "verified"
      );

    const query: Record<
      string,
      unknown
    > = {};

    /* SEARCH */

    if (search) {
      query.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          "location.city": {
            $regex: search,
            $options: "i",
          },
        },
        {
          "location.district": {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    /* PROPERTY TYPE */

    if (propertyType) {
      query.propertyType =
        propertyType;
    }

    /* PUBLISHED */

    if (published === "true") {
      query.isPublished = true;
    }

    if (published === "false") {
      query.isPublished = false;
    }

    /* VERIFIED */

    if (verified === "true") {
      query.isVerified = true;
    }

    if (verified === "false") {
      query.isVerified = false;
    }

    const total =
      await Hotel.countDocuments(
        query
      );

    const totalPages =
      total === 0
        ? 0
        : Math.ceil(
            total / limit
          );

    const skip =
      (page - 1) * limit;

    const hotels =
      await Hotel.find(query)
        .sort({
          createdAt: -1,
        })
        .skip(skip)
        .limit(limit)
        .lean();

    return NextResponse.json({
      success: true,
      data: hotels,

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
      "ADMIN_HOTELS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load hotels.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST - CREATE HOTEL
   ========================================================= */

export async function POST(
  req: NextRequest
) {
  try {
    const auth =
      await authenticateAdmin(req);

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

    await connectDB();

    const body =
      (await req.json()) as CreateHotelBody;

    const {
      name,
      slug,
      description,
      propertyType,
      location,
      coordinates,
      rating,
      reviewCount,
      priceFrom,
      currency,
      amenities,
      images,
      isVerified,
      isPublished,
    } = body;

    /* -----------------------------------------------------
       NAME
       ----------------------------------------------------- */

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hotel name is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       SLUG
       ----------------------------------------------------- */

    if (
      typeof slug !== "string" ||
      !slug.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hotel slug is required.",
        },
        {
          status: 400,
        }
      );
    }

    const normalizedSlug =
      slug
        .trim()
        .toLowerCase()
        .replace(/\s+/g, "-");

    /* -----------------------------------------------------
       DESCRIPTION
       ----------------------------------------------------- */

    if (
      typeof description !==
        "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hotel description is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       PROPERTY TYPE
       ----------------------------------------------------- */

    const validPropertyTypes:
      PropertyType[] = [
        "HOTEL",
        "RESORT",
        "VILLA",
        "APARTMENT",
        "GUEST_HOUSE",
        "BOUTIQUE_HOTEL",
        "HOSTEL",
        "HOMESTAY",
      ];

    if (
      !propertyType ||
      !validPropertyTypes.includes(
        propertyType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid property type is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       LOCATION
       ----------------------------------------------------- */

    if (
      !location ||
      typeof location !== "object" ||
      typeof location.address !==
        "string" ||
      !location.address.trim() ||
      typeof location.city !==
        "string" ||
      !location.city.trim() ||
      typeof location.district !==
        "string" ||
      !location.district.trim() ||
      typeof location.province !==
        "string" ||
      !location.province.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete hotel location is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       COORDINATES
       
       IMPORTANT:
       [longitude, latitude]
       ----------------------------------------------------- */

    if (
      !coordinates ||
      typeof coordinates !== "object" ||
      !Array.isArray(
        coordinates.coordinates
      ) ||
      coordinates.coordinates.length !==
        2
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid hotel coordinates are required.",
        },
        {
          status: 400,
        }
      );
    }

    const longitude =
      Number(
        coordinates.coordinates[0]
      );

    const latitude =
      Number(
        coordinates.coordinates[1]
      );

    if (
      !Number.isFinite(
        longitude
      ) ||
      longitude < -180 ||
      longitude > 180
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid longitude between -180 and 180.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !Number.isFinite(
        latitude
      ) ||
      latitude < -90 ||
      latitude > 90
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid latitude between -90 and 90.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       PRICE
       ----------------------------------------------------- */

    const numericPrice =
      Number(priceFrom);

    if (
      !Number.isFinite(
        numericPrice
      ) ||
      numericPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Valid starting price is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -----------------------------------------------------
       DUPLICATE SLUG
       ----------------------------------------------------- */

    const existingHotel =
      await Hotel.findOne({
        slug: normalizedSlug,
      });

    if (existingHotel) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A hotel with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    /* -----------------------------------------------------
       RATING
       ----------------------------------------------------- */

    const numericRating =
      Number(rating);

    const finalRating =
      Number.isFinite(
        numericRating
      )
        ? Math.min(
            5,
            Math.max(
              0,
              numericRating
            )
          )
        : 0;

    /* -----------------------------------------------------
       REVIEW COUNT
       ----------------------------------------------------- */

    const numericReviewCount =
      Number(reviewCount);

    const finalReviewCount =
      Number.isFinite(
        numericReviewCount
      )
        ? Math.max(
            0,
            numericReviewCount
          )
        : 0;

    /* -----------------------------------------------------
       CREATE HOTEL

       ownerId comes automatically
       from logged-in admin JWT.
       ----------------------------------------------------- */

    const hotel =
      await Hotel.create({
        name: name.trim(),

        slug: normalizedSlug,

        description:
          description.trim(),

        propertyType,

        location: {
          address:
            location.address.trim(),

          city:
            location.city.trim(),

          district:
            location.district.trim(),

          province:
            location.province.trim(),

          country:
            typeof location.country ===
              "string" &&
            location.country.trim()
              ? location.country.trim()
              : "Sri Lanka",
        },

        coordinates: {
          type: "Point",

          coordinates: [
            longitude,
            latitude,
          ],
        },

        rating: finalRating,

        reviewCount:
          finalReviewCount,

        priceFrom:
          numericPrice,

        currency: "LKR",

        amenities:
          Array.isArray(amenities)
            ? amenities
            : [],

        images:
          Array.isArray(images)
            ? images
            : [],

        isVerified:
          Boolean(isVerified),

        isPublished:
          Boolean(isPublished),

        /* IMPORTANT FIX */
        ownerId:
          auth.payload.userId,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Hotel created successfully.",
        data: hotel,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN_HOTEL_CREATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create hotel.",
      },
      {
        status: 500,
      }
    );
  }
}

