import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import Deal from "@/models/Deal";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

// =====================================================
// GET SINGLE DEAL
// =====================================================

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal ID",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const deal = await Deal.findById(id).lean();

    if (!deal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: deal,
    });
  } catch (error) {
    console.error(
      "GET /api/admin/deals/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch deal",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// UPDATE DEAL
// =====================================================

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal ID",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    await connectDB();

    const deal = await Deal.findByIdAndUpdate(
      id,
      {
        $set: body,
      },
      {
        new: true,
        runValidators: true,
      }
    ).lean();

    if (!deal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deal updated successfully",
      data: deal,
    });
  } catch (error) {
    console.error(
      "PUT /api/admin/deals/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update deal",
      },
      {
        status: 500,
      }
    );
  }
}

// =====================================================
// DELETE DEAL
// =====================================================

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid deal ID",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const deal = await Deal.findByIdAndDelete(id);

    if (!deal) {
      return NextResponse.json(
        {
          success: false,
          message: "Deal not found",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Deal deleted successfully",
    });
  } catch (error) {
    console.error(
      "DELETE /api/admin/deals/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete deal",
      },
      {
        status: 500,
      }
    );
  }
};