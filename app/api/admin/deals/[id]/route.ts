import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/lib/db/mongoose";
import { Deal } from "@/models/Deal";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// =====================================================
// GET — Single Deal
// =====================================================

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal ID is required.",
        },
        { status: 400 }
      );
    }

    const deal = await Deal.findById(id)
      .populate({
        path: "hotelId",
        select: "name slug location images",
      })
      .lean();

    if (!deal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        deal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET DEAL ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load deal.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// PUT — Update Deal
// =====================================================

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal ID is required.",
        },
        { status: 400 }
      );
    }

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
      startDate,
      endDate,
      maxBookings,
      promoCode,
      image,
      isFeatured,
      isPublished,
    } = body;

    // -----------------------------------------------
    // Validation
    // -----------------------------------------------

    if (!hotelId) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel is required.",
        },
        { status: 400 }
      );
    }

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal title is required.",
        },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal description is required.",
        },
        { status: 400 }
      );
    }

    if (
      discountValue === undefined ||
      discountValue === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Discount value is required.",
        },
        { status: 400 }
      );
    }

    if (
      originalPrice === undefined ||
      originalPrice === null ||
      dealPrice === undefined ||
      dealPrice === null
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Original price and deal price are required.",
        },
        { status: 400 }
      );
    }

    if (!startDate) {
      return NextResponse.json(
        {
          success: false,
          message: "Start date is required.",
        },
        { status: 400 }
      );
    }

    if (!endDate) {
      return NextResponse.json(
        {
          success: false,
          message: "End date is required.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Numbers
    // -----------------------------------------------

    const parsedDiscount = Number(discountValue);
    const parsedOriginal = Number(originalPrice);
    const parsedDeal = Number(dealPrice);

    if (
      Number.isNaN(parsedDiscount) ||
      parsedDiscount < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid discount value.",
        },
        { status: 400 }
      );
    }

    if (
      discountType === "PERCENTAGE" &&
      parsedDiscount > 100
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Percentage discount cannot exceed 100%.",
        },
        { status: 400 }
      );
    }

    if (
      Number.isNaN(parsedOriginal) ||
      parsedOriginal < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid original price.",
        },
        { status: 400 }
      );
    }

    if (
      Number.isNaN(parsedDeal) ||
      parsedDeal < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal price.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Dates
    // -----------------------------------------------

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    if (
      Number.isNaN(parsedStartDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid start date.",
        },
        { status: 400 }
      );
    }

    if (
      Number.isNaN(parsedEndDate.getTime())
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid end date.",
        },
        { status: 400 }
      );
    }

    if (parsedEndDate <= parsedStartDate) {
      return NextResponse.json(
        {
          success: false,
          message:
            "End date must be after start date.",
        },
        { status: 400 }
      );
    }

    // -----------------------------------------------
    // Slug
    // -----------------------------------------------

    const finalSlug =
      slug?.trim() ||
      title
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    // -----------------------------------------------
    // Duplicate slug check
    // -----------------------------------------------

    const existingDeal =
      await Deal.findOne({
        slug: finalSlug,
        _id: { $ne: id },
      });

    if (existingDeal) {
      return NextResponse.json(
        {
          success: false,
          message:
            "A deal with this slug already exists.",
        },
        { status: 409 }
      );
    }

    // -----------------------------------------------
    // Update
    // -----------------------------------------------

    const updatedDeal =
      await Deal.findByIdAndUpdate(
        id,
        {
          hotelId,

          title: title.trim(),

          slug: finalSlug,

          description:
            description.trim(),

          discountType:
            discountType === "FIXED"
              ? "FIXED"
              : "PERCENTAGE",

          discountValue:
            parsedDiscount,

          originalPrice:
            parsedOriginal,

          dealPrice:
            parsedDeal,

          currency: "LKR",

          startDate:
            parsedStartDate,

          endDate:
            parsedEndDate,

          maxBookings:
            maxBookings
              ? Number(maxBookings)
              : undefined,

          promoCode:
            promoCode?.trim()
              ? promoCode
                  .trim()
                  .toUpperCase()
              : undefined,

          image:
            image?.trim()
              ? image.trim()
              : undefined,

          isFeatured:
            Boolean(isFeatured),

          isPublished:
            Boolean(isPublished),
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedDeal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Deal updated successfully.",
        deal: updatedDeal,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "UPDATE DEAL ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to update deal.",
      },
      { status: 500 }
    );
  }
}

// =====================================================
// DELETE — Delete Deal
// =====================================================

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal ID is required.",
        },
        { status: 400 }
      );
    }

    const deletedDeal =
      await Deal.findByIdAndDelete(id);

    if (!deletedDeal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "Deal deleted successfully.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "DELETE DEAL ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete deal.",
      },
      { status: 500 }
    );
  }
}