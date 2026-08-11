import { NextRequest, NextResponse } from "next/server";
import { isValidObjectId } from "mongoose";

import connectDB from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import {
  Room,
  BedType,
  IRoomBed,
  RoomType,
} from "@/models/Room";
import { verifyToken } from "@/lib/auth/jwt";

/* =========================================================
   TYPES
========================================================= */

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

interface CreateRoomBody {
  name?: unknown;
  description?: unknown;
  roomType?: unknown;
  pricePerNight?: unknown;
  currency?: unknown;
  maxGuests?: unknown;
  beds?: unknown;
  size?: unknown;
  amenities?: unknown;
  images?: unknown;
  totalRooms?: unknown;
  isActive?: unknown;
}

/* =========================================================
   AUTHENTICATION
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

  const payload = verifyToken(token);

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
   CONSTANTS
========================================================= */

const validRoomTypes: RoomType[] = [
  "STANDARD",
  "DELUXE",
  "SUITE",
  "FAMILY",
  "VILLA",
];

const validBedTypes: BedType[] = [
  "SINGLE",
  "DOUBLE",
  "QUEEN",
  "KING",
  "TWIN",
];

/* =========================================================
   NORMALIZE BEDS
========================================================= */

function normalizeBeds(
  beds: unknown
): IRoomBed[] {
  if (!Array.isArray(beds)) {
    return [];
  }

  return beds.map((bed: unknown) => {
    if (
      typeof bed !== "object" ||
      bed === null
    ) {
      throw new Error(
        "Invalid bed information."
      );
    }

    const item =
      bed as Record<string, unknown>;

    const type = item.type;

    const count = Number(
      item.count
    );

    if (
      typeof type !== "string" ||
      !validBedTypes.includes(
        type as BedType
      )
    ) {
      throw new Error(
        "Invalid bed type."
      );
    }

    if (
      !Number.isInteger(count) ||
      count < 1
    ) {
      throw new Error(
        "Bed count must be at least 1."
      );
    }

    return {
      type: type as BedType,
      count,
    };
  });
}

/* =========================================================
   NORMALIZE STRING ARRAY
========================================================= */

function normalizeStringArray(
  value: unknown
): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter(
      (item): item is string =>
        typeof item === "string"
    )
    .map((item) => item.trim())
    .filter(Boolean);
}

/* =========================================================
   GET - HOTEL ROOMS
========================================================= */

export async function GET(
  req: NextRequest,
  context: RouteContext
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

    const { id } =
      await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid hotel ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const hotel =
      await Hotel.findById(id)
        .select("_id name")
        .lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hotel not found.",
        },
        {
          status: 404,
        }
      );
    }

    const rooms =
      await Room.find({
        hotelId: id,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return NextResponse.json({
      success: true,
      data: rooms,
    });
  } catch (error) {
    console.error(
      "ADMIN_ROOMS_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load rooms.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   POST - CREATE ROOM
========================================================= */

export async function POST(
  req: NextRequest,
  context: RouteContext
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

    const { id } =
      await context.params;

    if (!isValidObjectId(id)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid hotel ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    /* -------------------------------------------------------
       CHECK HOTEL
    ------------------------------------------------------- */

    const hotel =
      await Hotel.findById(id)
        .select("_id")
        .lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Hotel not found.",
        },
        {
          status: 404,
        }
      );
    }

    /* -------------------------------------------------------
       BODY
    ------------------------------------------------------- */

    const body =
      (await req.json()) as CreateRoomBody;

    const {
      name,
      description,
      roomType,
      pricePerNight,
      currency,
      maxGuests,
      beds,
      size,
      amenities,
      images,
      totalRooms,
      isActive,
    } = body;

    /* -------------------------------------------------------
       VALIDATE NAME
    ------------------------------------------------------- */

    if (
      typeof name !== "string" ||
      !name.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Room name is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       VALIDATE DESCRIPTION
    ------------------------------------------------------- */

    if (
      typeof description !==
        "string" ||
      !description.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Room description is required.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       VALIDATE ROOM TYPE
    ------------------------------------------------------- */

    if (
      typeof roomType !==
        "string" ||
      !validRoomTypes.includes(
        roomType as RoomType
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid room type.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       PRICE
    ------------------------------------------------------- */

    const price =
      Number(pricePerNight);

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Enter a valid room price.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       MAX GUESTS
    ------------------------------------------------------- */

    const guests =
      Number(maxGuests);

    if (
      !Number.isInteger(guests) ||
      guests < 1 ||
      guests > 20
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Maximum guests must be between 1 and 20.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       TOTAL ROOMS
    ------------------------------------------------------- */

    const roomCount =
      Number(totalRooms);

    if (
      !Number.isInteger(
        roomCount
      ) ||
      roomCount < 1
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Total rooms must be at least 1.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       BEDS
    ------------------------------------------------------- */

    let normalizedBeds: IRoomBed[];

    try {
      normalizedBeds =
        normalizeBeds(beds);
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Invalid bed information.",
        },
        {
          status: 400,
        }
      );
    }

    /* -------------------------------------------------------
       SIZE
    ------------------------------------------------------- */

    let normalizedSize:
      | number
      | undefined;

    if (
      size !== undefined &&
      size !== null &&
      size !== ""
    ) {
      const roomSize =
        Number(size);

      if (
        !Number.isFinite(
          roomSize
        ) ||
        roomSize < 1
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Room size must be greater than 0.",
          },
          {
            status: 400,
          }
        );
      }

      normalizedSize =
        roomSize;
    }

    /* -------------------------------------------------------
       AMENITIES
    ------------------------------------------------------- */

    const normalizedAmenities =
      normalizeStringArray(
        amenities
      );

    /* -------------------------------------------------------
       IMAGES
    ------------------------------------------------------- */

    const normalizedImages =
      normalizeStringArray(
        images
      );

    /* -------------------------------------------------------
       ACTIVE
    ------------------------------------------------------- */

    const active =
      typeof isActive ===
      "boolean"
        ? isActive
        : true;

    /* -------------------------------------------------------
       CREATE ROOM
    ------------------------------------------------------- */

    const room =
      await Room.create({
        hotelId: id,

        name: name.trim(),

        description:
          description.trim(),

        roomType:
          roomType as RoomType,

        pricePerNight:
          price,

        currency:
          currency === "LKR"
            ? "LKR"
            : "LKR",

        maxGuests:
          guests,

        beds:
          normalizedBeds,

        size:
          normalizedSize,

        amenities:
          normalizedAmenities,

        images:
          normalizedImages,

        totalRooms:
          roomCount,

        isActive:
          active,
      });

    return NextResponse.json(
      {
        success: true,
        message:
          "Room created successfully.",
        data: room,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "ADMIN_ROOM_CREATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create room.",
      },
      {
        status: 500,
      }
    );
  }
}