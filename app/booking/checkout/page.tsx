"use client";

import {
  ArrowLeft,
  ArrowRight,
  BedDouble,
  CalendarDays,
  Check,
  CreditCard,
  MapPin,
  ShieldCheck,
  Star,
  Users,
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

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-LK").format(price);
}

function calculateNights(
  checkIn: string,
  checkOut: string
) {
  if (!checkIn || !checkOut) {
    return 0;
  }

  const start = new Date(checkIn);
  const end = new Date(checkOut);

  const difference =
    end.getTime() - start.getTime();

  const nights = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  return nights > 0 ? nights : 0;
}

function formatRoomType(type: string) {
  return type
    .replaceAll("_", " ")
    .toLowerCase()
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase()
    );
}

function formatBeds(
  beds: Room["beds"]
) {
  return beds
    .map(
      (bed) =>
        `${bed.count} ${bed.type
          .toLowerCase()
          .replace(/\b\w/g, (letter) =>
            letter.toUpperCase()
          )}`
    )
    .join(" • ");
}

export default function CheckoutPage() {
  const [hotelSlug, setHotelSlug] =
    useState("");

  const [roomId, setRoomId] =
    useState("");

  const [hotel, setHotel] =
    useState<Hotel | null>(null);

  const [room, setRoom] =
    useState<Room | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [checkIn, setCheckIn] =
    useState("");

  const [checkOut, setCheckOut] =
    useState("");

  const [guests, setGuests] =
    useState(2);

  const [firstName, setFirstName] =
    useState("");

  const [lastName, setLastName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [specialRequest, setSpecialRequest] =
    useState("");

  const [agree, setAgree] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [submitError, setSubmitError] =
    useState("");

  useEffect(() => {
    const searchParams =
      new URLSearchParams(
        window.location.search
      );

    const hotelParam =
      searchParams.get("hotel");

    const roomParam =
      searchParams.get("room");

    if (!hotelParam || !roomParam) {
      setError(
        "Invalid booking link."
      );
      setLoading(false);
      return;
    }

    setHotelSlug(hotelParam);
    setRoomId(roomParam);
  }, []);

  useEffect(() => {
    if (!hotelSlug || !roomId) {
      return;
    }

    async function loadBookingData() {
      try {
        setLoading(true);
        setError("");

        const hotelResponse =
          await fetch(
            `/api/hotels/${hotelSlug}`,
            {
              cache: "no-store",
            }
          );

        if (!hotelResponse.ok) {
          throw new Error(
            "Hotel not found"
          );
        }

        const hotelResult =
          await hotelResponse.json();

        if (!hotelResult.success) {
          throw new Error(
            hotelResult.message ||
              "Hotel not found"
          );
        }

        const hotelData =
          hotelResult.data;

        setHotel(hotelData);

        const roomsResponse =
          await fetch(
            `/api/hotels/${hotelSlug}/rooms`,
            {
              cache: "no-store",
            }
          );

        if (!roomsResponse.ok) {
          throw new Error(
            "Rooms could not be loaded"
          );
        }

        const roomsResult =
          await roomsResponse.json();

        if (!roomsResult.success) {
          throw new Error(
            roomsResult.message ||
              "Rooms could not be loaded"
          );
        }

        const selectedRoom =
          roomsResult.data.find(
            (item: Room) =>
              item._id === roomId
          );

        if (!selectedRoom) {
          throw new Error(
            "Selected room not found"
          );
        }

        setRoom(selectedRoom);

        setGuests(
          Math.min(
            2,
            selectedRoom.maxGuests
          )
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load booking details."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBookingData();
  }, [hotelSlug, roomId]);

  const nights = useMemo(
    () =>
      calculateNights(
        checkIn,
        checkOut
      ),
    [checkIn, checkOut]
  );

  const roomTotal =
    room && nights > 0
      ? room.pricePerNight * nights
      : 0;

  const serviceFee =
    roomTotal > 0
      ? Math.round(roomTotal * 0.05)
      : 0;

  const total =
    roomTotal + serviceFee;

  function getToday() {
    const today = new Date();

    const year =
      today.getFullYear();

    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSubmitError("");

    if (!hotel || !room) {
      setSubmitError(
        "Booking information is missing."
      );
      return;
    }

    if (!checkIn || !checkOut) {
      setSubmitError(
        "Please select your check-in and check-out dates."
      );
      return;
    }

    if (nights <= 0) {
      setSubmitError(
        "Check-out must be after check-in."
      );
      return;
    }

    if (guests < 1) {
      setSubmitError(
        "Please select at least one guest."
      );
      return;
    }

    if (
      guests >
      room.maxGuests
    ) {
      setSubmitError(
        `This room allows up to ${room.maxGuests} guests.`
      );
      return;
    }

    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !phone.trim()
    ) {
      setSubmitError(
        "Please complete all guest details."
      );
      return;
    }

    if (!agree) {
      setSubmitError(
        "Please accept the booking terms."
      );
      return;
    }

    try {
      setSubmitting(true);

      const response =
        await fetch(
          "/api/bookings",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              hotelId: hotel._id,
              roomId: room._id,
              checkIn,
              checkOut,
              guests,
              guest: {
                firstName:
                  firstName.trim(),
                lastName:
                  lastName.trim(),
                email:
                  email.trim(),
                phone:
                  phone.trim(),
              },
              specialRequest:
                specialRequest.trim(),
              nights,
              roomPrice:
                room.pricePerNight,
              roomTotal,
              serviceFee,
              total,
              currency: "LKR",
            }),
          }
        );

      const result =
        await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Booking could not be created."
        );
      }

      if (result.data?._id) {
        window.location.href =
          `/booking/confirmation/${result.data._id}`;
      } else {
        window.location.href =
          `/booking/confirmation`;
      }
    } catch (err) {
      console.error(err);

      setSubmitError(
        err instanceof Error
          ? err.message
          : "Something went wrong while creating your booking."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#fafafa] dark:bg-[#050505]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="h-8 w-40 animate-pulse rounded-full bg-zinc-200 dark:bg-white/10" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-6">
              <div className="h-72 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />

              <div className="h-96 animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />
            </div>

            <div className="h-[500px] animate-pulse rounded-3xl bg-zinc-200 dark:bg-white/10" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !hotel || !room) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fafafa] px-4 dark:bg-[#050505]">
        <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
            <CalendarDays className="h-6 w-6 text-red-500" />
          </div>

          <h1 className="mt-5 text-2xl font-semibold">
            Unable to load booking
          </h1>

          <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
            {error ||
              "The selected hotel or room could not be found."}
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

  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#050505]/80">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
          <Link
            href={`/hotels/${hotel.slug}`}
            className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 transition hover:text-black dark:text-zinc-400 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hotel
          </Link>

          <div className="flex items-center gap-2 text-sm font-semibold">
            <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
            Secure Booking
          </div>
        </div>
      </header>

      {/* Page */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="mb-10">
          <p className="text-sm font-medium text-[#B8860B] dark:text-[#F5D76E]">
            BookingLK
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            Complete your booking
          </h1>

          <p className="mt-3 text-zinc-500 dark:text-zinc-400">
            Enter your stay details and guest information.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
          {/* LEFT */}
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Stay Details */}
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <CalendarDays className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Your stay
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Select your dates and number of guests.
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    Check-in
                  </label>

                  <input
                    type="date"
                    min={getToday()}
                    value={checkIn}
                    onChange={(event) => {
                      setCheckIn(
                        event.target.value
                      );

                      if (
                        checkOut &&
                        event.target.value >=
                          checkOut
                      ) {
                        setCheckOut("");
                      }
                    }}
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Check-out
                  </label>

                  <input
                    type="date"
                    min={
                      checkIn ||
                      getToday()
                    }
                    value={checkOut}
                    onChange={(event) =>
                      setCheckOut(
                        event.target.value
                      )
                    }
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-medium">
                    Guests
                  </label>

                  <div className="relative mt-2">
                    <Users className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

                    <select
                      value={guests}
                      onChange={(event) =>
                        setGuests(
                          Number(
                            event.target
                              .value
                          )
                        )
                      }
                      className="w-full appearance-none rounded-2xl border border-zinc-200 bg-white py-3.5 pl-12 pr-4 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                    >
                      {Array.from(
                        {
                          length:
                            room.maxGuests,
                        },
                        (_, index) =>
                          index + 1
                      ).map(
                        (value) => (
                          <option
                            key={value}
                            value={
                              value
                            }
                          >
                            {value}{" "}
                            {value ===
                            1
                              ? "Guest"
                              : "Guests"}
                          </option>
                        )
                      )}
                    </select>
                  </div>
                </div>
              </div>

              {nights > 0 && (
                <div className="mt-5 rounded-2xl bg-[#D4AF37]/10 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span>
                      Length of stay
                    </span>

                    <strong>
                      {nights}{" "}
                      {nights === 1
                        ? "night"
                        : "nights"}
                    </strong>
                  </div>
                </div>
              )}
            </section>

            {/* Guest Details */}
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <Users className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Guest details
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Who should we prepare the reservation for?
                  </p>
                </div>
              </div>

              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">
                    First name
                  </label>

                  <input
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                    placeholder="Sashika"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Last name
                  </label>

                  <input
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                    placeholder="Madushan"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Email
                  </label>

                  <input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    Phone number
                  </label>

                  <input
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="+94 77 123 4567"
                    className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                    required
                  />
                </div>
              </div>

              <div className="mt-5">
                <label className="text-sm font-medium">
                  Special request
                  <span className="ml-2 font-normal text-zinc-400">
                    Optional
                  </span>
                </label>

                <textarea
                  value={
                    specialRequest
                  }
                  onChange={(event) =>
                    setSpecialRequest(
                      event.target.value
                    )
                  }
                  placeholder="Any special requests for your stay?"
                  rows={4}
                  className="mt-2 w-full resize-none rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-[#0b0b0b]"
                />
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <CreditCard className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
                </div>

                <div>
                  <h2 className="text-xl font-semibold">
                    Payment
                  </h2>

                  <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                    Payment integration will be connected next.
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />

                  <div>
                    <p className="text-sm font-semibold">
                      Secure booking
                    </p>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      Your payment details will be handled securely.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Terms */}
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(event) =>
                    setAgree(
                      event.target.checked
                    )
                  }
                  className="mt-1 h-4 w-4 accent-[#D4AF37]"
                />

                <span className="text-sm leading-6 text-zinc-600 dark:text-zinc-400">
                  I agree to BookingLK's
                  booking terms,
                  cancellation policy and
                  property rules.
                </span>
              </label>

              {submitError && (
                <div className="mt-5 rounded-2xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-600 dark:text-red-400">
                  {submitError}
                </div>
              )}

              <button
                type="submit"
                disabled={
                  submitting ||
                  !agree
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-4 text-sm font-semibold text-black transition hover:bg-[#F5D76E] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Creating booking..."
                  : "Confirm booking"}

                {!submitting && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </button>
            </section>
          </form>

          {/* RIGHT SUMMARY */}
          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
              {/* Hotel image */}
              <div className="relative h-56">
                <img
                  src={
                    hotel.images?.[0] ||
                    "/images/hotel-placeholder.jpg"
                  }
                  alt={hotel.name}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-xs font-medium text-white/80">
                    Your selected stay
                  </p>

                  <h2 className="mt-1 text-xl font-semibold text-white">
                    {hotel.name}
                  </h2>
                </div>
              </div>

              <div className="p-6">
                {/* Location */}
                <div className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <MapPin className="h-4 w-4 text-[#D4AF37]" />

                  {hotel.location.city},{" "}
                  {hotel.location.district}
                </div>

                {/* Rating */}
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
                    <Star className="h-4 w-4 fill-current" />
                    {hotel.rating.toFixed(
                      1
                    )}
                  </div>

                  <span className="text-xs text-zinc-500">
                    {hotel.reviewCount} reviews
                  </span>
                </div>

                {/* Room */}
                <div className="mt-6 rounded-2xl bg-zinc-50 p-4 dark:bg-white/5">
                  <div className="flex gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-[#181818]">
                      <BedDouble className="h-5 w-5 text-[#D4AF37]" />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-zinc-500">
                        Selected room
                      </p>

                      <p className="mt-1 font-semibold">
                        {room.name}
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {formatRoomType(
                          room.roomType
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2 text-xs text-zinc-500">
                    <span>
                      {formatBeds(
                        room.beds
                      )}
                    </span>

                    <span>•</span>

                    <span>
                      Up to{" "}
                      {room.maxGuests}{" "}
                      guests
                    </span>

                    {room.size && (
                      <>
                        <span>
                          •
                        </span>

                        <span>
                          {room.size} m²
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Dates */}
                {checkIn &&
                  checkOut && (
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-zinc-200 p-3 dark:border-white/10">
                        <p className="text-[11px] uppercase tracking-wide text-zinc-400">
                          Check-in
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {checkIn}
                        </p>
                      </div>

                      <div className="rounded-2xl border border-zinc-200 p-3 dark:border-white/10">
                        <p className="text-[11px] uppercase tracking-wide text-zinc-400">
                          Check-out
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          {checkOut}
                        </p>
                      </div>
                    </div>
                  )}

                {/* Price */}
                <div className="mt-6 border-t border-zinc-200 pt-6 dark:border-white/10">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      LKR{" "}
                      {formatPrice(
                        room.pricePerNight
                      )}{" "}
                      × {nights || 0}{" "}
                      nights
                    </span>

                    <span>
                      LKR{" "}
                      {formatPrice(
                        roomTotal
                      )}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <span className="text-zinc-500">
                      Service fee
                    </span>

                    <span>
                      LKR{" "}
                      {formatPrice(
                        serviceFee
                      )}
                    </span>
                  </div>

                  <div className="mt-5 flex items-end justify-between border-t border-zinc-200 pt-5 dark:border-white/10">
                    <div>
                      <p className="text-xs text-zinc-500">
                        Total
                      </p>

                      <p className="mt-1 text-2xl font-semibold">
                        LKR{" "}
                        {formatPrice(
                          total
                        )}
                      </p>
                    </div>

                    {nights > 0 && (
                      <span className="text-xs text-zinc-500">
                        {nights}{" "}
                        {nights === 1
                          ? "night"
                          : "nights"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-6 flex items-start gap-3 rounded-2xl bg-[#D4AF37]/5 p-4">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />

                  <p className="text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    Free cancellation policies
                    depend on the selected
                    property's booking terms.
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}