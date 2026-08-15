import {
  NextRequest,
  NextResponse,
} from "next/server";

import { Types } from "mongoose";

import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";

import Review from "@/models/Review";
import Hotel from "@/models/Hotel";

interface RouteContext {
  params: Promise<{
    slug: string;
    reviewId: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| GET AUTHENTICATED USER
|--------------------------------------------------------------------------
*/

function getAuthenticatedUser(
  request: NextRequest
) {
  const token =
    request.cookies.get(
      "bookinglk_token"
    )?.value;

  if (!token) {
    return null;
  }

  const user =
    verifyToken(token);

  if (!user) {
    return null;
  }

  if (
    !user.userId ||
    !Types.ObjectId.isValid(
      user.userId
    )
  ) {
    return null;
  }

  return user;
}

/*
|--------------------------------------------------------------------------
| RECALCULATE HOTEL RATING
|--------------------------------------------------------------------------
*/

async function recalculateHotelRating(
  hotelId: Types.ObjectId
) {
  const stats =
    await Review.aggregate([
      {
        $match: {
          hotelId,

          isPublished: true,
        },
      },

      {
        $group: {
          _id: null,

          averageRating: {
            $avg: "$rating",
          },

          reviewCount: {
            $sum: 1,
          },
        },
      },
    ]);

  const reviewCount =
    stats[0]?.reviewCount || 0;

  const hotelRating =
    reviewCount > 0
      ? Number(
          Number(
            stats[0].averageRating
          ).toFixed(1)
        )
      : 0;

  await Hotel.findByIdAndUpdate(
    hotelId,
    {
      $set: {
        rating:
          hotelRating,

        reviewCount,
      },
    }
  );

  return {
    hotelRating,
    reviewCount,
  };
}

/*
|--------------------------------------------------------------------------
| PUT - EDIT REVIEW
|--------------------------------------------------------------------------
*/

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    const user =
      getAuthenticatedUser(
        request
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please log in to edit your review.",
        },
        {
          status: 401,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ROLE
    |--------------------------------------------------------------------------
    */

    if (user.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only guests can edit reviews.",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PARAMS
    |--------------------------------------------------------------------------
    */

    const {
      slug,
      reviewId,
    } = await context.params;

    /*
    |--------------------------------------------------------------------------
    | VALIDATE REVIEW ID
    |--------------------------------------------------------------------------
    */

    if (
      !Types.ObjectId.isValid(
        reviewId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid review ID.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FIND HOTEL
    |--------------------------------------------------------------------------
    */

    const hotel =
      await Hotel.findOne({
        slug,
        isPublished: true,
      });

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

    /*
    |--------------------------------------------------------------------------
    | FIND REVIEW
    |--------------------------------------------------------------------------
    */

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | HOTEL OWNERSHIP CHECK
    |--------------------------------------------------------------------------
    */

    if (
      review.hotelId.toString() !==
      hotel._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This review does not belong to this hotel.",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | OWNER CHECK
    |--------------------------------------------------------------------------
    */

    if (
      review.userId.toString() !==
      user.userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only edit your own review.",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | BODY
    |--------------------------------------------------------------------------
    */

    let body: {
      rating?: unknown;
      title?: unknown;
      comment?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PARSE
    |--------------------------------------------------------------------------
    */

    const rating =
      Number(body.rating);

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const comment =
      typeof body.comment === "string"
        ? body.comment.trim()
        : "";

    /*
    |--------------------------------------------------------------------------
    | VALIDATE RATING
    |--------------------------------------------------------------------------
    */

    if (
      !Number.isInteger(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Rating must be an integer between 1 and 5.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE COMMENT
    |--------------------------------------------------------------------------
    */

    if (comment.length < 5) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your review must contain at least 5 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (comment.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your review cannot exceed 2000 characters.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE TITLE
    |--------------------------------------------------------------------------
    */

    if (title.length > 120) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review title cannot exceed 120 characters.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | UPDATE
    |--------------------------------------------------------------------------
    */

    review.rating =
      rating;

    review.title =
      title;

    review.comment =
      comment;

    await review.save();

    /*
    |--------------------------------------------------------------------------
    | RECALCULATE HOTEL
    |--------------------------------------------------------------------------
    */

    const {
      hotelRating,
      reviewCount,
    } =
      await recalculateHotelRating(
        hotel._id
      );

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        success: true,

        message:
          "Review updated successfully.",

        data: {
          _id:
            review._id.toString(),

          hotelId:
            review.hotelId.toString(),

          userId:
            review.userId.toString(),

          bookingId:
            review.bookingId
              ? review.bookingId.toString()
              : undefined,

          userName:
            review.userName,

          rating:
            review.rating,

          title:
            review.title || "",

          comment:
            review.comment,

          createdAt:
            review.createdAt,

          updatedAt:
            review.updatedAt,

          isVerifiedStay:
            review.isVerifiedStay,

          isVerified:
            review.isVerifiedStay,

          hotelRating,

          reviewCount,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "UPDATE_REVIEW_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to update review.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE - DELETE REVIEW
|--------------------------------------------------------------------------
*/

export async function DELETE(
  request: NextRequest,
  context: RouteContext
) {
  try {
    await connectDB();

    /*
    |--------------------------------------------------------------------------
    | AUTH
    |--------------------------------------------------------------------------
    */

    const user =
      getAuthenticatedUser(
        request
      );

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please log in to delete your review.",
        },
        {
          status: 401,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | ROLE
    |--------------------------------------------------------------------------
    */

    if (user.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only guests can delete reviews.",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | PARAMS
    |--------------------------------------------------------------------------
    */

    const {
      slug,
      reviewId,
    } = await context.params;

    /*
    |--------------------------------------------------------------------------
    | VALIDATE REVIEW ID
    |--------------------------------------------------------------------------
    */

    if (
      !Types.ObjectId.isValid(
        reviewId
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid review ID.",
        },
        {
          status: 400,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | FIND HOTEL
    |--------------------------------------------------------------------------
    */

    const hotel =
      await Hotel.findOne({
        slug,
        isPublished: true,
      });

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

    /*
    |--------------------------------------------------------------------------
    | FIND REVIEW
    |--------------------------------------------------------------------------
    */

    const review =
      await Review.findById(
        reviewId
      );

    if (!review) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | HOTEL CHECK
    |--------------------------------------------------------------------------
    */

    if (
      review.hotelId.toString() !==
      hotel._id.toString()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This review does not belong to this hotel.",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | OWNER CHECK
    |--------------------------------------------------------------------------
    */

    if (
      review.userId.toString() !==
      user.userId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only delete your own review.",
        },
        {
          status: 403,
        }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | DELETE
    |--------------------------------------------------------------------------
    */

    await Review.findByIdAndDelete(
      reviewId
    );

    /*
    |--------------------------------------------------------------------------
    | RECALCULATE HOTEL
    |--------------------------------------------------------------------------
    */

    const {
      hotelRating,
      reviewCount,
    } =
      await recalculateHotelRating(
        hotel._id
      );

    /*
    |--------------------------------------------------------------------------
    | RESPONSE
    |--------------------------------------------------------------------------
    */

    return NextResponse.json(
      {
        success: true,

        message:
          "Review deleted successfully.",

        data: {
          reviewId,

          hotelRating,

          reviewCount,
        },
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.error(
      "DELETE_REVIEW_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to delete review.",
      },
      {
        status: 500,
      }
    );
  }
}