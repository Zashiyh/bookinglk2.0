import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { Deal } from "@/models/Deal";
import { Hotel } from "@/models/Hotel";

// =====================================================
// Types
// =====================================================

type PopulatedHotel = {
  _id?: unknown;
  name?: string;
  slug?: string;
  location?: {
    city?: string;
    [key: string]: unknown;
  };
  images?: unknown[];
};

type DealWithPopulatedHotel = {
  _id: unknown;
  hotelId: unknown;

  title: string;
  slug: string;
  description: string;

  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;

  originalPrice: number;
  dealPrice: number;

  currency: string;

  startDate: Date;
  endDate: Date;

  maxBookings?: number;
  bookingsCount: number;

  promoCode?: string;
  image?: string;

  isFeatured: boolean;
  isPublished: boolean;

  createdAt?: Date;
  updatedAt?: Date;
};

// =====================================================
// Helpers
// =====================================================

function createSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function objectIdToString(value: unknown) {
  if (!value) {
    return "";
  }

  if (
    typeof value === "object" &&
    value !== null &&
    "_id" in value
  ) {
    const id = (value as { _id?: unknown })._id;

    if (id && typeof (id as any).toString === "function") {
      return (id as any).toString();
    }
  }

  if (typeof (value as any)?.toString === "function") {
    return (value as any).toString();
  }

  return String(value);
}

function formatDeal(deal: any) {
  const populatedHotel =
    deal?.hotelId &&
    typeof deal.hotelId === "object"
      ? (deal.hotelId as PopulatedHotel)
      : null;

  const now = new Date();

  const startDate = new Date(deal.startDate);
  const endDate = new Date(deal.endDate);

  const isActive =
    Boolean(deal.isPublished) &&
    !Number.isNaN(startDate.getTime()) &&
    !Number.isNaN(endDate.getTime()) &&
    startDate <= now &&
    endDate >= now;

  return {
    ...deal,

    _id: objectIdToString(deal._id),

    hotelId: objectIdToString(
      deal.hotelId
    ),

    hotel: populatedHotel
      ? {
          _id: objectIdToString(
            populatedHotel._id
          ),

          name:
            populatedHotel.name ?? "",

          slug:
            populatedHotel.slug ?? "",

          location:
            populatedHotel.location ?? {},

          images:
            Array.isArray(
              populatedHotel.images
            )
              ? populatedHotel.images
              : [],
        }
      : null,

    /*
     * Frontend compatibility.
     *
     * Database field:
     * discountValue
     *
     * Frontend can use:
     * discountPercentage
     */
    discountPercentage:
      deal.discountType === "PERCENTAGE"
        ? Number(deal.discountValue) || 0
        : 0,

    /*
     * Calculated status.
     */
    isActive,
  };
}

// =====================================================
// GET — Admin Deals
// =====================================================

export async function GET() {
  try {
    await connectDB();

    const deals = await Deal.find({})
      .populate({
        path: "hotelId",
        select:
          "name slug location images",
      })
      .sort({
        createdAt: -1,
      })
      .lean();

    const formattedDeals =
      deals.map((deal) =>
        formatDeal(deal)
      );

    return NextResponse.json(
      {
        success: true,

        /*
         * Admin frontend can use result.data
         */
        data: formattedDeals,

        /*
         * Compatibility with code
         * that uses result.deals
         */
        deals: formattedDeals,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "GET ADMIN DEALS ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,

        message:
          error instanceof Error
            ? error.message
            : "Failed to load deals.",

        data: [],

        deals: [],
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// POST — Create Deal
// =====================================================

export async function POST(
  request: NextRequest
) {
  try {
    await connectDB();

    // =================================================
    // Read body
    // =================================================

    const body = await request.json();

    const {
      hotelId,
      title,
      slug,
      description,

      discountType,
      discountValue,

      originalPrice,
      dealPrice,

      currency,

      startDate,
      endDate,

      maxBookings,

      promoCode,
      image,

      isFeatured,
      isPublished,
    } = body;

    // =================================================
    // Hotel validation
    // =================================================

    if (!hotelId) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !/^[0-9a-fA-F]{24}$/.test(
        String(hotelId)
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid hotel ID.",
        },
        {
          status: 400,
        }
      );
    }

    const hotelExists =
      await Hotel.findById(hotelId)
        .select("_id")
        .lean();

    if (!hotelExists) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Selected hotel was not found.",
        },
        {
          status: 404,
        }
      );
    }

    // =================================================
    // Basic validation
    // =================================================

    if (
      typeof title !== "string" ||
      !title.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Deal title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof description !== "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Deal description is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // Discount validation
    // =================================================

    if (
      discountValue === undefined ||
      discountValue === null ||
      discountValue === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Discount value is required.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedDiscount =
      Number(discountValue);

    if (
      !Number.isFinite(
        parsedDiscount
      ) ||
      parsedDiscount < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid discount value.",
        },
        {
          status: 400,
        }
      );
    }

    const finalDiscountType =
      discountType === "FIXED"
        ? "FIXED"
        : "PERCENTAGE";

    if (
      finalDiscountType ===
        "PERCENTAGE" &&
      parsedDiscount > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Percentage discount cannot exceed 100%.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // Original price
    // =================================================

    if (
      originalPrice === undefined ||
      originalPrice === null ||
      originalPrice === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Original price is required.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedOriginalPrice =
      Number(originalPrice);

    if (
      !Number.isFinite(
        parsedOriginalPrice
      ) ||
      parsedOriginalPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid original price.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // Deal price
    // =================================================

    if (
      dealPrice === undefined ||
      dealPrice === null ||
      dealPrice === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Deal price is required.",
        },
        {
          status: 400,
        }
      );
    }

    const parsedDealPrice =
      Number(dealPrice);

    if (
      !Number.isFinite(
        parsedDealPrice
      ) ||
      parsedDealPrice < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid deal price.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // Start date
    // =================================================

    if (!startDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Start date is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // End date
    // =================================================

    if (!endDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "End date is required.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // Parse dates
    // =================================================

    const parsedStartDate =
      new Date(startDate);

    const parsedEndDate =
      new Date(endDate);

    if (
      Number.isNaN(
        parsedStartDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid start date.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      Number.isNaN(
        parsedEndDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid end date.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      parsedEndDate <=
      parsedStartDate
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "End date must be after start date.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // Max bookings
    // =================================================

    let parsedMaxBookings:
      | number
      | undefined;

    if (
      maxBookings !== undefined &&
      maxBookings !== null &&
      maxBookings !== ""
    ) {
      parsedMaxBookings =
        Number(maxBookings);

      if (
        !Number.isFinite(
          parsedMaxBookings
        ) ||
        parsedMaxBookings < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Maximum bookings must be at least 1.",
          },
          {
            status: 400,
          }
        );
      }

      parsedMaxBookings =
        Math.floor(
          parsedMaxBookings
        );
    }

    // =================================================
    // Slug
    // =================================================

    let finalSlug =
      typeof slug === "string"
        ? slug.trim()
        : "";

    if (!finalSlug) {
      finalSlug = createSlug(title);
    }

    if (!finalSlug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unable to generate deal slug.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // Duplicate slug
    // =================================================

    const existingDeal =
      await Deal.findOne({
        slug: finalSlug,
      }).lean();

    if (existingDeal) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A deal with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // =================================================
    // Promo code
    // =================================================

    const finalPromoCode =
      typeof promoCode === "string" &&
      promoCode.trim()
        ? promoCode
            .trim()
            .toUpperCase()
        : undefined;

    // =================================================
    // Image
    // =================================================

    const finalImage =
      typeof image === "string" &&
      image.trim()
        ? image.trim()
        : undefined;

    // =================================================
    // CREATE DEAL
    //
    // IMPORTANT:
    //
    // DO NOT use:
    // validFrom
    // validUntil
    // discountPercentage
    //
    // Your Deal model uses:
    // startDate
    // endDate
    // discountValue
    // =================================================

    const deal =
      await Deal.create({
        hotelId,

        title: title.trim(),

        slug: finalSlug,

        description:
          description.trim(),

        discountType:
          finalDiscountType,

        discountValue:
          parsedDiscount,

        originalPrice:
          parsedOriginalPrice,

        dealPrice:
          parsedDealPrice,

        currency:
          currency === "LKR"
            ? "LKR"
            : "LKR",

        startDate:
          parsedStartDate,

        endDate:
          parsedEndDate,

        maxBookings:
          parsedMaxBookings,

        bookingsCount: 0,

        promoCode:
          finalPromoCode,

        image:
          finalImage,

        isFeatured:
          Boolean(isFeatured),

        isPublished:
          isPublished !== false,
      });

    // =================================================
    // Populate created deal
    // =================================================

    const populatedDeal =
      await Deal.findById(
        deal._id
      )
        .populate({
          path: "hotelId",
          select:
            "name slug location images",
        })
        .lean();

    // =================================================
    // Format response
    // =================================================

    const responseDeal =
      populatedDeal
        ? formatDeal(populatedDeal)
        : formatDeal(deal.toObject());

    // =================================================
    // Success
    // =================================================

    return NextResponse.json(
      {
        success: true,

        message:
          "Deal created successfully.",

        data: responseDeal,

        deal: responseDeal,
      },
      {
        status: 201,
      }
    );
  } catch (error: any) {
    console.error(
      "CREATE DEAL ERROR:",
      error
    );

    // =================================================
    // Duplicate key
    // =================================================

    if (
      error?.code === 11000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A deal with this slug already exists.",
        },
        {
          status: 409,
        }
      );
    }

    // =================================================
    // Mongoose validation
    // =================================================

    if (
      error?.name ===
      "ValidationError"
    ) {
      const messages =
        Object.values(
          error.errors ?? {}
        )
          .map(
            (item: any) =>
              item?.message
          )
          .filter(Boolean)
          .join(", ");

      return NextResponse.json(
        {
          success: false,
          message:
            messages ||
            "Deal validation failed.",
        },
        {
          status: 400,
        }
      );
    }

    // =================================================
    // General error
    // =================================================

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to create deal.",
      },
      {
        status: 500,
      }
    );
  }
}