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
    roomId: string;
  }>;
}

interface UpdateRoomBody {
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
   AUTH
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

    const type =
      item.type;

    const count =
      Number(item.count);

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
   STRING ARRAY
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
    .map((item) =>
      item.trim()
    )
    .filter(Boolean);
}

/* =========================================================
   GET SINGLE ROOM
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

    const {
      id,
      roomId,
    } = await context.params;

    if (
      !isValidObjectId(id)
    ) {
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

    if (
      !isValidObjectId(roomId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid room ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const room =
      await Room.findOne({
        _id: roomId,
        hotelId: id,
      }).lean();

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Room not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: room,
    });
  } catch (error) {
    console.error(
      "ADMIN_ROOM_GET_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to load room.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   PATCH - UPDATE ROOM
========================================================= */

export async function PATCH(
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

    const {
      id,
      roomId,
    } = await context.params;

    if (
      !isValidObjectId(id)
    ) {
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

    if (
      !isValidObjectId(roomId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid room ID.",
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
       CHECK ROOM
    ------------------------------------------------------- */

    const existingRoom =
      await Room.findOne({
        _id: roomId,
        hotelId: id,
      });

    if (!existingRoom) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Room not found.",
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
      (await req.json()) as UpdateRoomBody;

    const update: Record<
      string,
      unknown
    > = {};

    /* -------------------------------------------------------
       NAME
    ------------------------------------------------------- */

    if (
      body.name !== undefined
    ) {
      if (
        typeof body.name !==
          "string" ||
        !body.name.trim()
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

      update.name =
        body.name.trim();
    }

    /* -------------------------------------------------------
       DESCRIPTION
    ------------------------------------------------------- */

    if (
      body.description !==
      undefined
    ) {
      if (
        typeof body.description !==
          "string" ||
        !body.description.trim()
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

      update.description =
        body.description.trim();
    }

    /* -------------------------------------------------------
       ROOM TYPE
    ------------------------------------------------------- */

    if (
      body.roomType !==
      undefined
    ) {
      if (
        typeof body.roomType !==
          "string" ||
        !validRoomTypes.includes(
          body.roomType as RoomType
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

      update.roomType =
        body.roomType as RoomType;
    }

    /* -------------------------------------------------------
       PRICE
    ------------------------------------------------------- */

    if (
      body.pricePerNight !==
      undefined
    ) {
      const price =
        Number(
          body.pricePerNight
        );

      if (
        !Number.isFinite(
          price
        ) ||
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

      update.pricePerNight =
        price;
    }

    /* -------------------------------------------------------
       CURRENCY
    ------------------------------------------------------- */

    if (
      body.currency !==
      undefined
    ) {
      update.currency = "LKR";
    }

    /* -------------------------------------------------------
       MAX GUESTS
    ------------------------------------------------------- */

    if (
      body.maxGuests !==
      undefined
    ) {
      const guests =
        Number(
          body.maxGuests
        );

      if (
        !Number.isInteger(
          guests
        ) ||
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

      update.maxGuests =
        guests;
    }

    /* -------------------------------------------------------
       BEDS
    ------------------------------------------------------- */

    if (
      body.beds !==
      undefined
    ) {
      try {
        const normalizedBeds =
          normalizeBeds(
            body.beds
          );

        update.beds =
          normalizedBeds;
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
    }

    /* -------------------------------------------------------
       SIZE
    ------------------------------------------------------- */

    if (
      body.size !==
      undefined
    ) {
      if (
        body.size === "" ||
        body.size === null
      ) {
        update.size =
          undefined;
      } else {
        const roomSize =
          Number(body.size);

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

        update.size =
          roomSize;
      }
    }

    /* -------------------------------------------------------
       AMENITIES
    ------------------------------------------------------- */

    if (
      body.amenities !==
      undefined
    ) {
      update.amenities =
        normalizeStringArray(
          body.amenities
        );
    }

    /* -------------------------------------------------------
       IMAGES
    ------------------------------------------------------- */

    if (
      body.images !==
      undefined
    ) {
      update.images =
        normalizeStringArray(
          body.images
        );
    }

    /* -------------------------------------------------------
       TOTAL ROOMS
    ------------------------------------------------------- */

    if (
      body.totalRooms !==
      undefined
    ) {
      const totalRooms =
        Number(
          body.totalRooms
        );

      if (
        !Number.isInteger(
          totalRooms
        ) ||
        totalRooms < 1
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

      update.totalRooms =
        totalRooms;
    }

    /* -------------------------------------------------------
       ACTIVE
    ------------------------------------------------------- */

    if (
      body.isActive !==
      undefined
    ) {
      if (
        typeof body.isActive !==
        "boolean"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              "Invalid room active status.",
          },
          {
            status: 400,
          }
        );
      }

      update.isActive =
        body.isActive;
    }

    /* -------------------------------------------------------
       UPDATE
    ------------------------------------------------------- */

    const room =
      await Room.findOneAndUpdate(
        {
          _id: roomId,
          hotelId: id,
        },
        {
          $set: update,
        },
        {
          new: true,
          runValidators: true,
        }
      ).lean();

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Room not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Room updated successfully.",
      data: room,
    });
  } catch (error) {
    console.error(
      "ADMIN_ROOM_UPDATE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to update room.",
      },
      {
        status: 500,
      }
    );
  }
}

/* =========================================================
   DELETE - DELETE ROOM
========================================================= */

export async function DELETE(
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

    const {
      id,
      roomId,
    } = await context.params;

    if (
      !isValidObjectId(id)
    ) {
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

    if (
      !isValidObjectId(roomId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid room ID.",
        },
        {
          status: 400,
        }
      );
    }

    await connectDB();

    const room =
      await Room.findOneAndDelete({
        _id: roomId,
        hotelId: id,
      });

    if (!room) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Room not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "Room deleted successfully.",
      data: {
        id: room._id,
      },
    });
  } catch (error) {
    console.error(
      "ADMIN_ROOM_DELETE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to delete room.",
      },
      {
        status: 500,
      }
    );
  }
}