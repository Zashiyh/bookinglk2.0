"use client";

import {
  ArrowLeft,
  ArrowUpRight,
  BedDouble,
  Car,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Heart,
  MapPin,
  Maximize,
  ShieldCheck,
  Star,
  Utensils,
  Users,
  Wifi,
  Waves,
  X,
  Send,
  MessageCircle,
  Trash2,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

interface Hotel {
  _id: string;
  name: string;
  slug: string;
  description: string;
  propertyType: string;

  location: {
    address: string;
    city: string;
    district: string;
    province: string;
    country: string;
  };

  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };

  rating: number;
  reviewCount: number;

  priceFrom: number;
  currency: "LKR";

  amenities: string[];
  images: string[];

  isVerified: boolean;
  isPublished: boolean;
}

interface Room {
  _id: string;
  hotelId: string;
  name: string;
  description: string;

  roomType:
    | "STANDARD"
    | "DELUXE"
    | "SUITE"
    | "FAMILY"
    | "VILLA";

  pricePerNight: number;
  currency: "LKR";

  maxGuests: number;

  beds: {
    type:
      | "SINGLE"
      | "DOUBLE"
      | "QUEEN"
      | "KING"
      | "TWIN";
    count: number;
  }[];

  size?: number;

  amenities: string[];
  images: string[];

  totalRooms: number;
  isActive: boolean;
}

interface Review {
  _id: string;
  hotelId?: string;
  userId?: string;

  user?: {
    _id?: string;
    id?: string;
    name?: string;
    email?: string;
    avatar?: string;
  };

  name?: string;
  userName?: string;

  rating: number;
  title?: string;
  comment: string;

  createdAt: string;
  updatedAt?: string;

  isVerified?: boolean;
  isVerifiedStay?: boolean;
}

interface HotelPageProps {
  params: Promise<{
    slug: string;
  }>;
}

interface CurrentUser {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
}

const amenityIcons = [
  Wifi,
  Waves,
  Car,
  Coffee,
  Utensils,
];

export default function HotelDetailsPage({
  params,
}: HotelPageProps) {
  const [slug, setSlug] = useState("");

  const [hotel, setHotel] = useState<Hotel | null>(
    null
  );

  const [rooms, setRooms] = useState<Room[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] =
    useState(true);

  const [error, setError] = useState("");

  const [favorite, setFavorite] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const [currentUser, setCurrentUser] =
    useState<CurrentUser | null>(null);

  const [userLoading, setUserLoading] = useState(true);

  const [showReviewModal, setShowReviewModal] =
    useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewName, setReviewName] = useState("");

  const [reviewSubmitting, setReviewSubmitting] =
    useState(false);

  const [reviewMessage, setReviewMessage] = useState("");

  const [deletingReviewId, setDeletingReviewId] =
    useState<string | null>(null);

  const [deleteMessage, setDeleteMessage] = useState("");

  /*
   * Resolve slug
   */
  useEffect(() => {
    async function resolveSlug() {
      try {
        const resolvedParams = await params;

        if (!resolvedParams?.slug) {
          throw new Error("Missing hotel slug");
        }

        setSlug(resolvedParams.slug);
      } catch (err) {
        console.error(
          "RESOLVE_SLUG_ERROR:",
          err
        );

        setError("Invalid hotel URL.");
        setLoading(false);
      }
    }

    resolveSlug();
  }, [params]);

  /*
   * Current user
   */
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        setUserLoading(true);

        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setCurrentUser(null);
          return;
        }

        const result = await response.json();

        if (result?.success && result?.data) {
          setCurrentUser(result.data);
        } else if (result?.user) {
          setCurrentUser(result.user);
        } else {
          setCurrentUser(null);
        }
      } catch (err) {
        console.error(
          "FETCH_CURRENT_USER_ERROR:",
          err
        );

        setCurrentUser(null);
      } finally {
        setUserLoading(false);
      }
    }

    fetchCurrentUser();
  }, []);

  /*
   * Fetch hotel / rooms / reviews
   */
  useEffect(() => {
    if (!slug) return;

    async function fetchHotel() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/hotels/${encodeURIComponent(slug)}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message || "Hotel not found"
          );
        }

        setHotel(result.data);
        setActiveImage(0);
      } catch (err) {
        console.error(
          "FETCH_HOTEL_ERROR:",
          err
        );

        setHotel(null);
        setError(
          "We couldn't load this hotel."
        );
      } finally {
        setLoading(false);
      }
    }

    async function fetchRooms() {
      try {
        setRoomsLoading(true);

        const response = await fetch(
          `/api/hotels/${encodeURIComponent(
            slug
          )}/rooms`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message ||
              "Failed to load rooms"
          );
        }

        setRooms(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "FETCH_ROOMS_ERROR:",
          err
        );

        setRooms([]);
      } finally {
        setRoomsLoading(false);
      }
    }

    async function fetchReviews() {
      try {
        setReviewsLoading(true);

        const response = await fetch(
          `/api/hotels/${encodeURIComponent(
            slug
          )}/reviews`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result?.success) {
          throw new Error(
            result?.message ||
              "Failed to load reviews"
          );
        }

        setReviews(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (err) {
        console.error(
          "FETCH_REVIEWS_ERROR:",
          err
        );

        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    }

    fetchHotel();
    fetchRooms();
    fetchReviews();
  }, [slug]);

  /*
   * Gallery
   */
  const galleryImages = useMemo(() => {
    if (
      hotel?.images &&
      Array.isArray(hotel.images) &&
      hotel.images.length > 0
    ) {
      return hotel.images.filter(Boolean);
    }

    return [
      "/images/hotel-placeholder.jpg",
    ];
  }, [hotel]);

  /*
   * Formatters
   */
  function formatPrice(price: number) {
    return new Intl.NumberFormat(
      "en-LK"
    ).format(Number(price) || 0);
  }

  function formatPropertyType(type: string) {
    return String(type || "")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  function formatRoomType(type: string) {
    return String(type || "")
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  }

  function formatBed(beds: Room["beds"]) {
    if (!beds?.length) {
      return "Bed information unavailable";
    }

    return beds
      .map((bed) => {
        const type = String(bed.type || "")
          .toLowerCase()
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          );

        return `${bed.count} ${type}`;
      })
      .join(" • ");
  }

  function formatReviewDate(date: string) {
    try {
      const parsed = new Date(date);

      if (Number.isNaN(parsed.getTime())) {
        return "";
      }

      return new Intl.DateTimeFormat(
        "en-LK",
        {
          year: "numeric",
          month: "short",
          day: "numeric",
        }
      ).format(parsed);
    } catch {
      return "";
    }
  }

  /*
   * Review user ID
   */
  function getReviewUserId(
    review: Review
  ) {
    return (
      review.userId ||
      review.user?._id ||
      review.user?.id ||
      ""
    );
  }

  /*
   * Own review
   */
  function isOwnReview(
    review: Review
  ) {
    if (!currentUser) {
      return false;
    }

    const currentUserId =
      currentUser._id ||
      currentUser.id ||
      "";

    const reviewUserId =
      getReviewUserId(review);

    if (
      !currentUserId ||
      !reviewUserId
    ) {
      return false;
    }

    return (
      String(currentUserId) ===
      String(reviewUserId)
    );
  }

  /*
   * Submit review
   */
  async function handleSubmitReview() {
    if (!slug) return;

    if (!reviewComment.trim()) {
      setReviewMessage(
        "Please write a review before submitting."
      );

      return;
    }

    if (reviewComment.trim().length < 5) {
      setReviewMessage(
        "Your review must contain at least 5 characters."
      );

      return;
    }

    try {
      setReviewSubmitting(true);
      setReviewMessage("");

      const response = await fetch(
        `/api/hotels/${encodeURIComponent(
          slug
        )}/reviews`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            rating: reviewRating,

            comment:
              reviewComment.trim(),

            title: "",

            name:
              reviewName.trim() ||
              undefined,
          }),
        }
      );

      const result =
        await response.json();

      if (response.status === 401) {
        setReviewMessage(
          "Please log in to write a review."
        );

        return;
      }

      if (response.status === 403) {
        setReviewMessage(
          result?.message ||
            "You can only review a hotel after completing a stay at this property."
        );

        return;
      }

      if (response.status === 409) {
        setReviewMessage(
          result?.message ||
            "You have already reviewed this hotel."
        );

        return;
      }

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Unable to submit review."
        );
      }

      if (result?.data) {
        const data = result.data;

        const newReview: Review = {
          _id: data._id,

          hotelId:
            data.hotelId,

          userId:
            data.userId,

          userName:
            data.userName,

          name:
            data.userName,

          rating:
            Number(data.rating) || 0,

          title:
            data.title || "",

          comment:
            data.comment || "",

          createdAt:
            data.createdAt ||
            new Date().toISOString(),

          isVerified:
            data.isVerifiedStay,

          isVerifiedStay:
            data.isVerifiedStay,
        };

        setReviews((current) => [
          newReview,
          ...current,
        ]);

        setHotel((current) => {
          if (!current) return current;

          return {
            ...current,

            rating:
              typeof data.hotelRating ===
              "number"
                ? data.hotelRating
                : current.rating,

            reviewCount:
              typeof data.reviewCount ===
              "number"
                ? data.reviewCount
                : current.reviewCount,
          };
        });
      }

      setReviewComment("");
      setReviewName("");
      setReviewRating(5);

      setReviewMessage(
        "Your verified review has been submitted successfully."
      );

      setTimeout(() => {
        setShowReviewModal(false);
        setReviewMessage("");
      }, 1400);
    } catch (err) {
      console.error(
        "SUBMIT_REVIEW_ERROR:",
        err
      );

      setReviewMessage(
        err instanceof Error
          ? err.message
          : "Unable to submit review."
      );
    } finally {
      setReviewSubmitting(false);
    }
  }

  /*
   * Delete review
   */
  async function handleDeleteReview(
    reviewId: string
  ) {
    if (!slug || !reviewId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this review? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingReviewId(reviewId);
      setDeleteMessage("");

      const response = await fetch(
        `/api/hotels/${encodeURIComponent(
          slug
        )}/reviews/${encodeURIComponent(
          reviewId
        )}`,
        {
          method: "DELETE",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      const result =
        await response.json();

      if (response.status === 401) {
        setDeleteMessage(
          "Please log in again to delete your review."
        );

        return;
      }

      if (response.status === 403) {
        setDeleteMessage(
          result?.message ||
            "You are not allowed to delete this review."
        );

        return;
      }

      if (response.status === 404) {
        setDeleteMessage(
          result?.message ||
            "Review was not found."
        );

        setReviews((current) =>
          current.filter(
            (review) =>
              review._id !== reviewId
          )
        );

        return;
      }

      if (
        !response.ok ||
        !result?.success
      ) {
        throw new Error(
          result?.message ||
            "Unable to delete review."
        );
      }

      setReviews((current) =>
        current.filter(
          (review) =>
            review._id !== reviewId
        )
      );

      if (result?.data) {
        setHotel((current) => {
          if (!current) return current;

          return {
            ...current,

            rating:
              typeof result.data
                .hotelRating ===
              "number"
                ? result.data.hotelRating
                : current.rating,

            reviewCount:
              typeof result.data
                .reviewCount ===
              "number"
                ? result.data.reviewCount
                : Math.max(
                    0,
                    current.reviewCount - 1
                  ),
          };
        });
      } else {
        setHotel((current) => {
          if (!current) return current;

          return {
            ...current,

            reviewCount: Math.max(
              0,
              current.reviewCount - 1
            ),
          };
        });
      }

      setDeleteMessage(
        "Your review has been deleted successfully."
      );

      setTimeout(() => {
        setDeleteMessage("");
      }, 2000);
    } catch (err) {
      console.error(
        "DELETE_REVIEW_ERROR:",
        err
      );

      setDeleteMessage(
        err instanceof Error
          ? err.message
          : "Unable to delete review."
      );
    } finally {
      setDeletingReviewId(null);
    }
  }

  /*
   * Loading
   */
  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="mb-8 h-5 w-32 animate-pulse rounded-full bg-zinc-200 dark:bg-white/10" />

          <div className="h-10 w-2/3 animate-pulse rounded-xl bg-zinc-200 dark:bg-white/10" />

          <div className="mt-4 h-5 w-1/3 animate-pulse rounded-xl bg-zinc-200 dark:bg-white/10" />

          <div className="mt-8 h-[320px] animate-pulse rounded-[2rem] bg-zinc-200 dark:bg-white/10 sm:h-[460px] lg:h-[560px]" />

          <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
            <div className="space-y-5">
              <div className="h-8 w-56 animate-pulse rounded bg-zinc-200 dark:bg-white/10" />

              <div className="h-32 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />

              <div className="h-48 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />
            </div>

            <div className="h-72 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  /*
   * Error
   */
  if (error || !hotel) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 text-zinc-950 dark:bg-[#050505] dark:text-white">
        <div className="w-full max-w-lg rounded-[2rem] border border-zinc-200 bg-white p-10 text-center shadow-xl dark:border-white/10 dark:bg-[#111111]">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37]/10">
            <MapPin className="h-7 w-7 text-[#D4AF37]" />
          </div>

          <h1 className="mt-6 text-3xl font-semibold">
            Hotel not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            {error ||
              "This property may no longer be available."}
          </p>

          <Link
            href="/hotels"
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
          >
            <ArrowLeft className="h-4 w-4" />

            Back to hotels
          </Link>
        </div>
      </main>
    );
  }

  /*
   * Main page
   */
  return (
    <>
      <main className="min-h-screen overflow-hidden bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-15%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />

          <div className="absolute right-[-15%] top-[30%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[140px]" />
        </div>

        {/* Navigation */}
        <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/hotels"
            className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-x-0.5 hover:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />

            Back to hotels
          </Link>
        </section>

        {/* Hotel header */}
        <section className="mx-auto max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-4 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#D4AF37]/10 px-3 py-1.5 text-xs font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                  {formatPropertyType(
                    hotel.propertyType
                  )}
                </span>

                {hotel.isVerified && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-3 py-1.5 text-xs font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                    <ShieldCheck className="h-3.5 w-3.5" />

                    BookingLK Verified
                  </span>
                )}
              </div>

              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                {hotel.name}
              </h1>

              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />

                  {hotel.location?.city || "Unknown"},{" "}
                  {hotel.location?.district || ""}
                </span>

                <span className="hidden h-4 w-px bg-zinc-300 dark:bg-white/10 sm:block" />

                <span className="inline-flex items-center gap-1.5">
                  <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />

                  <strong className="text-zinc-900 dark:text-white">
                    {Number(
                      hotel.rating || 0
                    ).toFixed(1)}
                  </strong>

                  <span>
                    ({hotel.reviewCount || 0}{" "}
                    reviews)
                  </span>
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setFavorite(
                  (value) => !value
                )
              }
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm transition hover:scale-105 hover:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
              aria-label={
                favorite
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
            >
              <Heart
                className={`h-5 w-5 transition ${
                  favorite
                    ? "fill-[#D4AF37] text-[#D4AF37]"
                    : ""
                }`}
              />
            </button>
          </div>
        </section>

        {/* Gallery */}
        <section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] border border-black/10 bg-zinc-100 shadow-2xl dark:border-white/10 dark:bg-[#111111]">
            <div className="relative h-[300px] sm:h-[430px] lg:h-[580px]">
              <img
                src={
                  galleryImages[
                    activeImage
                  ] ||
                  "/images/hotel-placeholder.jpg"
                }
                alt={hotel.name}
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.src =
                    "/images/hotel-placeholder.jpg";
                }}
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-black/20" />

              {galleryImages.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        (current) =>
                          current === 0
                            ? galleryImages.length -
                              1
                            : current - 1
                      )
                    }
                    className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-xl transition hover:scale-105 hover:bg-black/50"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setActiveImage(
                        (current) =>
                          current ===
                          galleryImages.length -
                            1
                            ? 0
                            : current + 1
                      )
                    }
                    className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/30 text-white backdrop-blur-xl transition hover:scale-105 hover:bg-black/50"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <div className="absolute bottom-5 left-5 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs font-medium text-white backdrop-blur-xl">
                {activeImage + 1} /{" "}
                {galleryImages.length}
              </div>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto p-3">
                {galleryImages.map(
                  (image, index) => (
                    <button
                      type="button"
                      key={`${image}-${index}`}
                      onClick={() =>
                        setActiveImage(index)
                      }
                      className={`h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                        activeImage === index
                          ? "border-[#D4AF37] opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${hotel.name} ${
                          index + 1
                        }`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  )
                )}
              </div>
            )}
          </div>
        </section>

        {/* Main content */}
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1fr_360px]">
            <div className="min-w-0">
              {/* About */}
              <section>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-[#D4AF37]" />

                  <h2 className="text-2xl font-semibold">
                    About this property
                  </h2>
                </div>

                <p className="mt-5 max-w-3xl whitespace-pre-line text-[15px] leading-8 text-zinc-600 dark:text-zinc-400">
                  {hotel.description ||
                    "No description available for this property."}
                </p>

                <div className="mt-7 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                      <MapPin className="h-5 w-5 text-[#D4AF37]" />
                    </div>

                    <div>
                      <p className="font-medium">
                        {hotel.location?.address ||
                          "Address unavailable"}
                      </p>

                      <p className="mt-1.5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                        {hotel.location?.city},{" "}
                        {hotel.location?.district},{" "}
                        {hotel.location?.province},{" "}
                        {hotel.location?.country}
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Amenities */}
              <section className="mt-14">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1 rounded-full bg-[#D4AF37]" />

                  <h2 className="text-2xl font-semibold">
                    Amenities
                  </h2>
                </div>

                {hotel.amenities?.length > 0 ? (
                  <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {hotel.amenities.map(
                      (
                        amenity,
                        index
                      ) => {
                        const Icon =
                          amenityIcons[
                            index %
                              amenityIcons.length
                          ];

                        return (
                          <div
                            key={`${amenity}-${index}`}
                            className="group flex items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/40 dark:border-white/10 dark:bg-[#111111]"
                          >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                              <Icon className="h-4 w-4 text-[#B8860B] dark:text-[#F5D76E]" />
                            </div>

                            <span className="text-sm">
                              {amenity}
                            </span>
                          </div>
                        );
                      }
                    )}
                  </div>
                ) : (
                  <p className="mt-5 text-sm text-zinc-500">
                    No amenities listed.
                  </p>
                )}
              </section>

              {/* Rooms */}
              <section
                className="mt-16"
                id="rooms"
              >
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 rounded-full bg-[#D4AF37]" />

                      <h2 className="text-2xl font-semibold">
                        Available rooms
                      </h2>
                    </div>

                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      Choose the room that best
                      fits your stay.
                    </p>
                  </div>

                  {!roomsLoading && (
                    <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium dark:bg-white/5">
                      {rooms.length} room types
                    </span>
                  )}
                </div>

                {roomsLoading ? (
                  <div className="mt-6 space-y-5">
                    {Array.from({
                      length: 3,
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="h-64 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10"
                      />
                    ))}
                  </div>
                ) : rooms.length === 0 ? (
                  <div className="mt-6 rounded-3xl border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-white/10 dark:bg-[#111111]">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                      <BedDouble className="h-7 w-7 text-[#D4AF37]" />
                    </div>

                    <h3 className="mt-4 font-semibold">
                      No rooms available
                    </h3>

                    <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                      This property currently
                      has no active rooms listed.
                    </p>
                  </div>
                ) : (
                  <div className="mt-6 space-y-5">
                    {rooms.map((room) => (
                      <article
                        key={room._id}
                        className="group overflow-hidden rounded-[2rem] border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#111111]"
                      >
                        <div className="grid md:grid-cols-[280px_1fr]">
                          <div className="relative min-h-[240px] overflow-hidden bg-zinc-100 dark:bg-[#181818]">
                            <img
                              src={
                                room.images?.[0] ||
                                "/images/hotel-placeholder.jpg"
                              }
                              alt={room.name}
                              className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              onError={(event) => {
                                event.currentTarget.src =
                                  "/images/hotel-placeholder.jpg";
                              }}
                            />

                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                            <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-xl">
                              {formatRoomType(
                                room.roomType
                              )}
                            </div>
                          </div>

                          <div className="p-6 lg:p-7">
                            <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                              <div>
                                <h3 className="text-xl font-semibold">
                                  {room.name}
                                </h3>

                                <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                                  {room.description ||
                                    "No room description available."}
                                </p>
                              </div>

                              <div className="shrink-0 sm:text-right">
                                <p className="text-xs text-zinc-500">
                                  From
                                </p>

                                <p className="mt-1 text-xl font-semibold">
                                  LKR{" "}
                                  {formatPrice(
                                    room.pricePerNight
                                  )}
                                </p>

                                <p className="text-xs text-zinc-500">
                                  per night
                                </p>
                              </div>
                            </div>

                            <div className="mt-5 flex flex-wrap gap-2">
                              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                                <BedDouble className="h-4 w-4" />

                                {formatBed(
                                  room.beds
                                )}
                              </span>

                              <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                                <Users className="h-4 w-4" />

                                Up to{" "}
                                {room.maxGuests}{" "}
                                guests
                              </span>

                              {room.size && (
                                <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-2 text-sm text-zinc-600 dark:bg-white/5 dark:text-zinc-400">
                                  <Maximize className="h-4 w-4" />

                                  {room.size} m²
                                </span>
                              )}
                            </div>

                            {room.amenities?.length >
                              0 && (
                              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {room.amenities
                                  .slice(
                                    0,
                                    6
                                  )
                                  .map(
                                    (
                                      amenity
                                    ) => (
                                      <span
                                        key={
                                          amenity
                                        }
                                        className="inline-flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400"
                                      >
                                        <Check className="h-3.5 w-3.5 text-[#D4AF37]" />

                                        {
                                          amenity
                                        }
                                      </span>
                                    )
                                  )}
                              </div>
                            )}

                            <div className="mt-6 flex flex-col gap-4 border-t border-zinc-200 pt-5 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                              <p className="text-xs text-zinc-500">
                                {room.totalRooms}{" "}
                                rooms available
                              </p>

                              <Link
                                href={`/booking/checkout?hotel=${encodeURIComponent(
                                  hotel.slug
                                )}&room=${encodeURIComponent(
                                  room._id
                                )}`}
                                className="group/button inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
                              >
                                Book this room

                                <ArrowUpRight className="h-4 w-4 transition-transform group-hover/button:-translate-y-0.5 group-hover/button:translate-x-0.5" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* Reviews */}
              <section
                className="mt-20"
                id="reviews"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-1 rounded-full bg-[#D4AF37]" />

                      <h2 className="text-2xl font-semibold">
                        Guest reviews
                      </h2>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4">
                      <div className="flex items-center gap-2">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                          <Star className="h-6 w-6 fill-[#D4AF37] text-[#D4AF37]" />
                        </div>

                        <div>
                          <p className="text-xl font-semibold">
                            {Number(
                              hotel.rating || 0
                            ).toFixed(1)}
                          </p>

                          <p className="text-xs text-zinc-500">
                            {(
                              hotel.reviewCount ||
                              0
                            ).toLocaleString()}{" "}
                            reviews
                          </p>
                        </div>
                      </div>

                      <div className="hidden h-10 w-px bg-zinc-200 dark:bg-white/10 sm:block" />

                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <=
                                Math.round(
                                  hotel.rating ||
                                    0
                                )
                                  ? "fill-[#D4AF37] text-[#D4AF37]"
                                  : "text-zinc-300 dark:text-zinc-700"
                              }`}
                            />
                          )
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowReviewModal(
                        true
                      )
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black shadow-sm transition hover:-translate-y-0.5 hover:bg-[#F5D76E] hover:shadow-lg"
                  >
                    <MessageCircle className="h-4 w-4" />

                    Write a review
                  </button>
                </div>

                {deleteMessage && (
                  <div
                    className={`mt-5 rounded-2xl px-4 py-3 text-sm ${
                      deleteMessage.includes(
                        "successfully"
                      )
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "bg-red-500/10 text-red-600 dark:text-red-400"
                    }`}
                  >
                    {deleteMessage}
                  </div>
                )}

                {reviewsLoading ? (
                  <div className="mt-8 space-y-4">
                    {Array.from({
                      length: 3,
                    }).map((_, index) => (
                      <div
                        key={index}
                        className="h-40 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10"
                      />
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="mt-8 rounded-[2rem] border border-dashed border-zinc-300 bg-white p-10 text-center dark:border-white/10 dark:bg-[#111111]">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                      <MessageCircle className="h-7 w-7 text-[#D4AF37]" />
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                      No reviews yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      Be the first guest to
                      share your experience
                      at this property.
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setShowReviewModal(
                          true
                        )
                      }
                      className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
                    >
                      <MessageCircle className="h-4 w-4" />

                      Write the first review
                    </button>
                  </div>
                ) : (
                  <div className="mt-8 space-y-4">
                    {reviews.map(
                      (review) => {
                        const ownReview =
                          isOwnReview(
                            review
                          );

                        const isDeleting =
                          deletingReviewId ===
                          review._id;

                        const reviewerName =
                          review.user?.name ||
                          review.name ||
                          review.userName ||
                          "Guest";

                        return (
                          <article
                            key={
                              review._id
                            }
                            className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]"
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#D4AF37]/10 text-sm font-bold text-[#B8860B] dark:text-[#F5D76E]">
                                  {reviewerName
                                    .charAt(
                                      0
                                    )
                                    .toUpperCase()}
                                </div>

                                <div>
                                  <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="font-semibold">
                                      {
                                        reviewerName
                                      }
                                    </h3>

                                    {review.isVerifiedStay && (
                                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                                        Verified
                                      </span>
                                    )}
                                  </div>

                                  <p className="mt-1 text-xs text-zinc-500">
                                    {formatReviewDate(
                                      review.createdAt
                                    )}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-1 rounded-full bg-[#D4AF37]/10 px-2.5 py-1.5">
                                  <Star className="h-3.5 w-3.5 fill-[#D4AF37] text-[#D4AF37]" />

                                  <span className="text-xs font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                                    {Number(
                                      review.rating ||
                                        0
                                    ).toFixed(
                                      1
                                    )}
                                  </span>
                                </div>

                                {ownReview && (
                                  <button
                                    type="button"
                                    disabled={
                                      isDeleting ||
                                      userLoading
                                    }
                                    onClick={() =>
                                      handleDeleteReview(
                                        review._id
                                      )
                                    }
                                    className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                                  >
                                    {isDeleting ? (
                                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                    ) : (
                                      <Trash2 className="h-3.5 w-3.5" />
                                    )}

                                    {isDeleting
                                      ? "Deleting..."
                                      : "Delete"}
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="mt-4 flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <Star
                                    key={
                                      star
                                    }
                                    className={`h-4 w-4 ${
                                      star <=
                                      review.rating
                                        ? "fill-[#D4AF37] text-[#D4AF37]"
                                        : "text-zinc-300 dark:text-zinc-700"
                                    }`}
                                  />
                                )
                              )}
                            </div>

                            {review.title && (
                              <h4 className="mt-4 font-semibold">
                                {
                                  review.title
                                }
                              </h4>
                            )}

                            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                              {
                                review.comment
                              }
                            </p>
                          </article>
                        );
                      }
                    )}
                  </div>
                )}
              </section>
            </div>

            {/* Booking card */}
            <aside className="lg:sticky lg:top-24 lg:h-fit">
              <div className="rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-xl dark:border-white/10 dark:bg-[#111111]">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Starting from
                    </p>

                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-3xl font-semibold">
                        LKR{" "}
                        {formatPrice(
                          hotel.priceFrom
                        )}
                      </span>

                      <span className="text-sm text-zinc-500">
                        / night
                      </span>
                    </div>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                    <Star className="h-5 w-5 fill-[#D4AF37] text-[#D4AF37]" />
                  </div>
                </div>

                <div className="mt-6 space-y-3 rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      Rating
                    </span>

                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Star className="h-4 w-4 fill-[#D4AF37] text-[#D4AF37]" />

                      {Number(
                        hotel.rating || 0
                      ).toFixed(1)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      Reviews
                    </span>

                    <span>
                      {(
                        hotel.reviewCount ||
                        0
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      Room types
                    </span>

                    <span>
                      {rooms.length}
                    </span>
                  </div>
                </div>

                <a
                  href="#rooms"
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E] hover:shadow-lg"
                >
                  View available rooms

                  <ArrowUpRight className="h-4 w-4" />
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setShowReviewModal(
                      true
                    )
                  }
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-white py-3.5 text-sm font-semibold transition hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 dark:border-white/10 dark:bg-white/5"
                >
                  <MessageCircle className="h-4 w-4 text-[#D4AF37]" />

                  Write a review
                </button>

                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-zinc-500">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />

                  Secure booking
                </div>

                <p className="mt-2 text-center text-xs text-zinc-500">
                  You won't be charged yet.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </main>

      {/* Review modal */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
          onClick={() =>
            !reviewSubmitting &&
            setShowReviewModal(false)
          }
        >
          <div
            className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111111] sm:p-8"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <button
              type="button"
              onClick={() =>
                !reviewSubmitting &&
                setShowReviewModal(false)
              }
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition hover:bg-zinc-200 dark:bg-white/5 dark:hover:bg-white/10"
              aria-label="Close review modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="pr-12">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <MessageCircle className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <h2 className="mt-5 text-2xl font-semibold">
                Write a review
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Share your experience at{" "}
                <span className="font-medium text-zinc-800 dark:text-white">
                  {hotel.name}
                </span>
              </p>
            </div>

            <div className="mt-7">
              <label className="text-sm font-medium">
                Your name
              </label>

              <input
                type="text"
                value={reviewName}
                onChange={(event) =>
                  setReviewName(
                    event.target.value
                  )
                }
                placeholder="Enter your name"
                className="mt-2 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-white/10 dark:bg-white/5"
              />
            </div>

            <div className="mt-6">
              <label className="text-sm font-medium">
                Your rating
              </label>

              <div className="mt-3 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map(
                  (star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewRating(
                          star
                        )
                      }
                      className="rounded-xl p-1 transition hover:scale-110"
                      aria-label={`Rate ${star} out of 5`}
                    >
                      <Star
                        className={`h-8 w-8 transition ${
                          star <=
                          reviewRating
                            ? "fill-[#D4AF37] text-[#D4AF37]"
                            : "text-zinc-300 dark:text-zinc-700"
                        }`}
                      />
                    </button>
                  )
                )}

                <span className="ml-2 text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                  {reviewRating}/5
                </span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">
                  Your review
                </label>

                <span className="text-xs text-zinc-500">
                  {reviewComment.length}/1000
                </span>
              </div>

              <textarea
                value={reviewComment}
                onChange={(event) =>
                  setReviewComment(
                    event.target.value.slice(
                      0,
                      1000
                    )
                  )
                }
                placeholder="Tell other travelers about your experience..."
                rows={6}
                className="mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 dark:border-white/10 dark:bg-white/5"
              />
            </div>

            {reviewMessage && (
              <div
                className={`mt-4 rounded-2xl px-4 py-3 text-sm ${
                  reviewMessage.includes(
                    "successfully"
                  )
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "bg-red-500/10 text-red-600 dark:text-red-400"
                }`}
              >
                {reviewMessage}
              </div>
            )}

            <button
              type="button"
              disabled={reviewSubmitting}
              onClick={
                handleSubmitReview
              }
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {reviewSubmitting ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/30 border-t-black" />

                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />

                  Submit review
                </>
              )}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-zinc-500">
              By submitting a review, you
              agree that your feedback may be
              displayed on BookingLK.
            </p>
          </div>
        </div>
      )}
    </>
  );
}