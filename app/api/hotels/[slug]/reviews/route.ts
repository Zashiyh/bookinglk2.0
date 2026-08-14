import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";

import connectDB from "@/lib/db/mongoose";
import { verifyToken } from "@/lib/auth/jwt";

import Hotel from "@/models/Hotel";
import Review from "@/models/Review";
import Booking from "@/models/Booking";
import User from "@/models/User";

interface RouteContext {
  params: Promise<{
    slug: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| GET REVIEWS
|--------------------------------------------------------------------------
*/

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { slug } = await params;

    const hotel = await Hotel.findOne({
      slug,
      isPublished: true,
    }).lean();

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel not found.",
        },
        { status: 404 }
      );
    }

    const reviews = await Review.find({
      hotelId: hotel._id,
      isPublished: true,
    })
      .sort({
        createdAt: -1,
      })
      .lean();

    const formattedReviews = reviews.map((review) => ({
      _id: review._id.toString(),

      hotelId: review.hotelId?.toString(),

      userId: review.userId?.toString(),

      rating: review.rating,

      title: review.title || "",

      comment: review.comment,

      userName: review.userName || "Guest",

      isVerifiedStay: Boolean(
        review.isVerifiedStay
      ),

      isVerified: Boolean(
        review.isVerifiedStay
      ),

      createdAt: review.createdAt,

      updatedAt: review.updatedAt,
    }));

    return NextResponse.json({
      success: true,

      data: formattedReviews,

      summary: {
        rating: hotel.rating || 0,

        reviewCount:
          hotel.reviewCount || 0,
      },
    });
  } catch (error) {
    console.error(
      "GET_REVIEWS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load reviews.",
      },
      { status: 500 }
    );
  }
}

/*
|--------------------------------------------------------------------------
| POST REVIEW
|--------------------------------------------------------------------------
*/

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    await connectDB();

    const { slug } = await params;

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATION
    |--------------------------------------------------------------------------
    */

    /*
     * Login route creates:
     *
     * bookinglk_token
     *
     * We also keep token/accessToken support
     * in case older sessions still exist.
     */

    const token =
      request.cookies.get(
        "bookinglk_token"
      )?.value ||
      request.cookies.get("token")?.value ||
      request.cookies.get(
        "accessToken"
      )?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please log in to write a review.",
        },
        { status: 401 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VERIFY TOKEN
    |--------------------------------------------------------------------------
    */

    const user = verifyToken(token);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your session has expired. Please log in again.",
        },
        { status: 401 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | USER ROLE
    |--------------------------------------------------------------------------
    */

    if (user.role !== "USER") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Only guests can write hotel reviews.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | HOTEL
    |--------------------------------------------------------------------------
    */

    const hotel = await Hotel.findOne({
      slug,
      isPublished: true,
    });

    if (!hotel) {
      return NextResponse.json(
        {
          success: false,
          message: "Hotel not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VALIDATE USER ID
    |--------------------------------------------------------------------------
    */

    if (
      !user.userId ||
      !Types.ObjectId.isValid(user.userId)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid user account.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | LOAD USER
    |--------------------------------------------------------------------------
    */

    const dbUser =
      await User.findById(
        user.userId
      ).lean();

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            "User account not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | REQUEST BODY
    |--------------------------------------------------------------------------
    */

    const body = await request.json();

    const rating = Number(body.rating);

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
            "Rating must be between 1 and 5.",
        },
        { status: 400 }
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
            "Review must contain at least 5 characters.",
        },
        { status: 400 }
      );
    }

    if (comment.length > 2000) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Review is too long.",
        },
        { status: 400 }
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
            "Review title is too long.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK DUPLICATE REVIEW
    |--------------------------------------------------------------------------
    */

    const existingReview =
      await Review.findOne({
        hotelId: hotel._id,
        userId: user.userId,
      });

    if (existingReview) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You have already reviewed this hotel.",
        },
        { status: 409 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VERIFY COMPLETED STAY
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    |
    | A user can review ONLY if they have a
    | COMPLETED booking for this hotel.
    |
    | CONFIRMED is NOT enough.
    |
    */

    const completedBooking =
      await Booking.findOne({
        hotelId: hotel._id,

        $or: [
          {
            userId: user.userId,
          },
          {
            "guest.email": user.email,
          },
        ],

        status: "COMPLETED",
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    /*
    |--------------------------------------------------------------------------
    | NO COMPLETED BOOKING
    |--------------------------------------------------------------------------
    */

    if (!completedBooking) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You can only review a hotel after completing a stay at this property.",
        },
        { status: 403 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | USER NAME
    |--------------------------------------------------------------------------
    */

    const userRecord = dbUser as {
      firstName?: string;
      lastName?: string;
      name?: string;
      email?: string;
    };

    const userName =
      [
        userRecord.firstName,
        userRecord.lastName,
      ]
        .filter(Boolean)
        .join(" ")
        .trim() ||
      userRecord.name ||
      userRecord.email ||
      user.email ||
      "Guest";

    /*
    |--------------------------------------------------------------------------
    | CREATE VERIFIED REVIEW
    |--------------------------------------------------------------------------
    */

    const review =
      await Review.create({
        userId: user.userId,

        hotelId: hotel._id,

        bookingId:
          completedBooking._id,

        rating,

        title,

        comment,

        userName,

        isPublished: true,

        /*
         * Because a COMPLETED booking was found,
         * this review is automatically verified.
         */

        isVerifiedStay: true,
      });

    /*
    |--------------------------------------------------------------------------
    | RECALCULATE HOTEL RATING
    |--------------------------------------------------------------------------
    */

    const ratingStats =
      await Review.aggregate([
        {
          $match: {
            hotelId: hotel._id,
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

    const stats =
      ratingStats[0] || {
        averageRating: rating,
        reviewCount: 1,
      };

    const newRating =
      Math.round(
        stats.averageRating * 10
      ) / 10;

    /*
    |--------------------------------------------------------------------------
    | UPDATE HOTEL
    |--------------------------------------------------------------------------
    */

    await Hotel.findByIdAndUpdate(
      hotel._id,
      {
        $set: {
          rating: newRating,

          reviewCount:
            stats.reviewCount,
        },
      }
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
          "Verified review submitted successfully.",

        data: {
          _id: review._id.toString(),

          hotelId:
            review.hotelId.toString(),

          userId:
            review.userId.toString(),

          rating: review.rating,

          title: review.title || "",

          comment: review.comment,

          userName:
            review.userName,

          isVerifiedStay: true,

          isVerified: true,

          createdAt:
            review.createdAt,

          hotelRating: newRating,

          reviewCount:
            stats.reviewCount,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "POST_REVIEW_ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to submit review.",
      },
      { status: 500 }
    );
  }
}