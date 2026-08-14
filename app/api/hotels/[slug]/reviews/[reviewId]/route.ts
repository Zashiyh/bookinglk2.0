import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import connectDB from "@/lib/db/mongoose";
import Review from "@/models/Review";
import Hotel from "@/models/Hotel";

interface RouteContext {
  params: Promise<{
    slug: string;
    reviewId: string;
  }>;
}

interface JwtPayload {
  userId?: string;
  id?: string;
  _id?: string;
}

/*
|--------------------------------------------------------------------------
| GET USER ID FROM AUTHENTICATION COOKIE
|--------------------------------------------------------------------------
*/

function getUserIdFromRequest(
  request: NextRequest
): string | null {
  try {
    /*
     * BookingLK uses ONE authentication cookie:
     *
     * bookinglk_token
     */

    const token =
      request.cookies.get("bookinglk_token")?.value;

    if (!token) {
      console.log(
        "REVIEW AUTH: bookinglk_token not found."
      );

      return null;
    }

    /*
     * JWT secret
     */

    const secret =
      process.env.JWT_SECRET;

    if (!secret) {
      console.error(
        "REVIEW AUTH: JWT_SECRET is missing from environment variables."
      );

      return null;
    }

    /*
     * Verify JWT
     */

    const decoded =
      jwt.verify(
        token,
        secret
      ) as JwtPayload;

    /*
     * Get user ID from JWT payload
     */

    const userId =
      decoded.userId ||
      decoded.id ||
      decoded._id ||
      null;

    if (!userId) {
      console.error(
        "REVIEW AUTH: JWT does not contain a user ID."
      );

      return null;
    }

    /*
     * Validate MongoDB ObjectId
     */

    if (
      !mongoose.Types.ObjectId.isValid(
        userId
      )
    ) {
      console.error(
        "REVIEW AUTH: Invalid user ID:",
        userId
      );

      return null;
    }

    return userId;
  } catch (error) {
    console.error(
      "REVIEW AUTH JWT ERROR:",
      error
    );

    return null;
  }
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
     * Authenticate user
     */

    const userId =
      getUserIdFromRequest(request);

    if (!userId) {
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
     * Get route parameters
     */

    const {
      slug,
      reviewId,
    } = await context.params;

    /*
     * Validate review ID
     */

    if (
      !mongoose.Types.ObjectId.isValid(
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
     * Parse request body
     */

    const body =
      await request.json();

    const rating =
      Number(body.rating);

    const comment =
      typeof body.comment === "string"
        ? body.comment.trim()
        : "";

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    /*
     * Validate rating
     */

    if (
      !Number.isFinite(rating) ||
      rating < 1 ||
      rating > 5
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Rating must be between 1 and 5.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Validate comment
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
     * Find review
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
     * Security:
     * Only review owner can edit
     */

    if (
      review.userId.toString() !==
      userId
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
     * Find hotel
     */

    const hotel =
      await Hotel.findOne({
        slug,
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
     * Security:
     * Review must belong to this hotel
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
     * Update review
     */

    review.rating =
      rating;

    review.comment =
      comment;

    review.title =
      title;

    await review.save();

    /*
     * Recalculate hotel rating
     */

    const publishedReviews =
      await Review.find({
        hotelId: hotel._id,
        isPublished: true,
      }).select("rating");

    const reviewCount =
      publishedReviews.length;

    const totalRating =
      publishedReviews.reduce(
        (sum, item) =>
          sum + item.rating,
        0
      );

    const hotelRating =
      reviewCount > 0
        ? Number(
            (
              totalRating /
              reviewCount
            ).toFixed(1)
          )
        : 0;

    hotel.rating =
      hotelRating;

    hotel.reviewCount =
      reviewCount;

    await hotel.save();

    /*
     * Response
     */

    return NextResponse.json(
      {
        success: true,
        message:
          "Review updated successfully.",
        data: {
          _id: review._id,
          hotelId:
            review.hotelId,
          userId:
            review.userId,
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
     * Authenticate user
     */

    const userId =
      getUserIdFromRequest(request);

    if (!userId) {
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
     * Get route parameters
     */

    const {
      slug,
      reviewId,
    } = await context.params;

    /*
     * Validate review ID
     */

    if (
      !mongoose.Types.ObjectId.isValid(
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
     * Find review
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
     * Security:
     * Only review owner can delete
     */

    if (
      review.userId.toString() !==
      userId
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
     * Find hotel
     */

    const hotel =
      await Hotel.findOne({
        slug,
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
     * Security:
     * Review must belong to this hotel
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
     * Delete review
     */

    await Review.findByIdAndDelete(
      reviewId
    );

    /*
     * Recalculate hotel rating
     */

    const publishedReviews =
      await Review.find({
        hotelId: hotel._id,
        isPublished: true,
      }).select("rating");

    const reviewCount =
      publishedReviews.length;

    const totalRating =
      publishedReviews.reduce(
        (sum, item) =>
          sum + item.rating,
        0
      );

    const hotelRating =
      reviewCount > 0
        ? Number(
            (
              totalRating /
              reviewCount
            ).toFixed(1)
          )
        : 0;

    hotel.rating =
      hotelRating;

    hotel.reviewCount =
      reviewCount;

    await hotel.save();

    /*
     * Success response
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