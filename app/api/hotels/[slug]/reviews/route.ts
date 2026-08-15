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

      hotelId: review.hotelId
        ? review.hotelId.toString()
        : undefined,

      userId: review.userId
        ? review.userId.toString()
        : undefined,

      bookingId: review.bookingId
        ? review.bookingId.toString()
        : undefined,

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
        reviewCount: hotel.reviewCount || 0,
      },
    });
  } catch (error) {
    console.error("GET_REVIEWS_ERROR:", error);

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

    const now = new Date();

    /*
    |--------------------------------------------------------------------------
    | AUTHENTICATION
    |--------------------------------------------------------------------------
    */

    const token =
      request.cookies.get("bookinglk_token")?.value ||
      request.cookies.get("token")?.value ||
      request.cookies.get("accessToken")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Please log in to write a review.",
        },
        { status: 401 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | VERIFY JWT
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
    | FIND HOTEL
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
    | LOAD USER
    |--------------------------------------------------------------------------
    */

    const dbUser = await User.findById(
      user.userId
    ).lean();

    if (!dbUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User account not found.",
        },
        { status: 404 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | REQUEST BODY
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
          message: "Invalid request body.",
        },
        { status: 400 }
      );
    }

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
          message: "Rating must be between 1 and 5.",
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
          message: "Review is too long.",
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
          message: "Review title is too long.",
        },
        { status: 400 }
      );
    }

    /*
    |--------------------------------------------------------------------------
    | CHECK DUPLICATE REVIEW
    |--------------------------------------------------------------------------
    */

    const existingReview = await Review.findOne({
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
    | NORMALIZE EMAIL
    |--------------------------------------------------------------------------
    */

    const userEmail =
      typeof user.email === "string"
        ? user.email.trim().toLowerCase()
        : "";

    /*
    |--------------------------------------------------------------------------
    | FIND ELIGIBLE BOOKING
    |--------------------------------------------------------------------------
    |
    | Booking must:
    |
    | 1. Belong to this hotel
    |
    | 2. Belong to the current user
    |    OR have matching guest email
    |
    | 3. Be COMPLETED
    |    OR be CONFIRMED with checkout already passed
    |
    */

    const userConditions: Record<string, unknown>[] = [
      {
        userId: new Types.ObjectId(user.userId),
      },
    ];

    if (userEmail) {
      userConditions.push({
        "guest.email": userEmail,
      });
    }

    const stayConditions: Record<string, unknown>[] = [
      {
        status: "COMPLETED",
      },
      {
        status: "CONFIRMED",
        checkOut: {
          $lte: now,
        },
      },
    ];

    /*
    |--------------------------------------------------------------------------
    | ELIGIBLE BOOKING QUERY
    |--------------------------------------------------------------------------
    */

    const eligibleBooking = await Booking.findOne({
      hotelId: hotel._id,

      $and: [
        {
          $or: userConditions,
        },
        {
          $or: stayConditions,
        },
      ],
    })
      .sort({
        checkOut: -1,
        createdAt: -1,
      })
      .lean();

    /*
    |--------------------------------------------------------------------------
    | NO ELIGIBLE BOOKING
    |--------------------------------------------------------------------------
    */

    if (!eligibleBooking) {
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
    | AUTO COMPLETE BOOKING
    |--------------------------------------------------------------------------
    */

    if (
      eligibleBooking.status === "CONFIRMED" &&
      eligibleBooking.checkOut &&
      new Date(
        eligibleBooking.checkOut
      ).getTime() <= now.getTime()
    ) {
      try {
        await Booking.findByIdAndUpdate(
          eligibleBooking._id,
          {
            $set: {
              status: "COMPLETED",
            },
          }
        );
      } catch (statusError) {
        console.error(
          "AUTO_COMPLETE_BOOKING_ERROR:",
          statusError
        );
      }
    }

    /*
    |--------------------------------------------------------------------------
    | USER NAME
    |--------------------------------------------------------------------------
    */

    const userName =
      [
        dbUser.firstName,
        dbUser.lastName,
      ]
        .filter(
          (value): value is string =>
            typeof value === "string" &&
            value.trim().length > 0
        )
        .join(" ")
        .trim() ||
      dbUser.email ||
      user.email ||
      "Guest";

    /*
    |--------------------------------------------------------------------------
    | CREATE VERIFIED REVIEW
    |--------------------------------------------------------------------------
    */

    const review = await Review.create({
      userId: new Types.ObjectId(user.userId),

      hotelId: hotel._id,

      bookingId: eligibleBooking._id,

      rating,

      title,

      comment,

      userName,

      isPublished: true,

      isVerifiedStay: true,
    });

    /*
    |--------------------------------------------------------------------------
    | RECALCULATE HOTEL RATING
    |--------------------------------------------------------------------------
    */

    const ratingStats = await Review.aggregate([
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

    const stats = ratingStats[0] || {
      averageRating: rating,
      reviewCount: 1,
    };

    const newRating =
      Math.round(
        Number(stats.averageRating) * 10
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
          reviewCount: stats.reviewCount,
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

          bookingId: review.bookingId
            ? review.bookingId.toString()
            : undefined,

          rating: review.rating,

          title: review.title || "",

          comment: review.comment,

          userName: review.userName,

          isVerifiedStay: true,

          isVerified: true,

          createdAt: review.createdAt,

          updatedAt: review.updatedAt,

          hotelRating: newRating,

          reviewCount: stats.reviewCount,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST_REVIEW_ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit review.",
      },
      { status: 500 }
    );
  }
}