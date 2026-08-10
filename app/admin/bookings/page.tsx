
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CalendarDays,
  Users,
  Hotel,
  Clock3,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-react";

type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

interface Booking {
  _id?: string;
  id?: string;
  bookingReference: string;

  hotelId: string;
  roomId: string;

  checkIn: string;
  checkOut: string;

  guests: number;

  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  specialRequest?: string;

  nights: number;
  roomPrice: number;
  roomTotal: number;
  serviceFee: number;
  total: number;

  currency: "LKR";

  status: BookingStatus;

  paymentStatus: PaymentStatus;

  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const statusConfig: Record<
  BookingStatus,
  {
    label: string;
    icon: typeof CheckCircle2;
    className: string;
  }
> = {
  PENDING: {
    label: "Pending",
    icon: Clock3,
    className:
      "border-amber-500/20 bg-amber-500/10 text-amber-400",
  },

  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },

  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    className:
      "border-red-500/20 bg-red-500/10 text-red-400",
  },

  COMPLETED: {
    label: "Completed",
    icon: CheckCircle2,
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getGuestName(booking: Booking) {
  return `${booking.guest?.firstName ?? ""} ${
    booking.guest?.lastName ?? ""
  }`.trim() || "Guest";
}

function getShortId(value: string) {
  if (!value) return "-";

  return value.length > 8
    ? value.slice(-8)
    : value;
}

export default function AdminBookingsPage() {
  const router = useRouter();

  const [bookings, setBookings] = useState<Booking[]>([]);

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState<
    "ALL" | BookingStatus
  >("ALL");

  const [currentPage, setCurrentPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [pagination, setPagination] =
    useState<Pagination>({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPreviousPage: false,
    });

  useEffect(() => {
    let cancelled = false;

    async function loadBookings() {
      try {
        setLoading(true);
        setError("");

        const params = new URLSearchParams();

        params.set(
          "page",
          String(currentPage)
        );

        params.set("limit", "10");

        if (search.trim()) {
          params.set(
            "search",
            search.trim()
          );
        }

        if (status !== "ALL") {
          params.set("status", status);
        }

        const response = await fetch(
          `/api/admin/bookings?${params.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          }
        );

        const contentType =
          response.headers.get(
            "content-type"
          ) || "";

        const text = await response.text();

        let result: {
          success?: boolean;
          message?: string;
          data?: Booking[];
          pagination?: Pagination;
        } = {};

        if (
          contentType.includes(
            "application/json"
          ) &&
          text.trim()
        ) {
          try {
            result = JSON.parse(text);
          } catch {
            throw new Error(
              "Server returned invalid JSON."
            );
          }
        } else if (text.trim()) {
          throw new Error(
            `Server returned an invalid response (${response.status}).`
          );
        }

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              `Unable to load bookings (${response.status})`
          );
        }

        if (cancelled) return;

        setBookings(
          Array.isArray(result.data)
            ? result.data
            : []
        );

        if (result.pagination) {
          setPagination(
            result.pagination
          );
        }
      } catch (error) {
        if (cancelled) return;

        console.error(
          "ADMIN_BOOKINGS_ERROR:",
          error
        );

        setBookings([]);

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load bookings."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadBookings();

    return () => {
      cancelled = true;
    };
  }, [
    currentPage,
    search,
    status,
  ]);

  const totalBookings =
    pagination.total;

  const pendingBookings =
    bookings.filter(
      (booking) =>
        booking.status === "PENDING"
    ).length;

  const confirmedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "CONFIRMED"
    ).length;

  const completedBookings =
    bookings.filter(
      (booking) =>
        booking.status === "COMPLETED"
    ).length;

  const totalRevenue =
    bookings
      .filter(
        (booking) =>
          booking.status ===
            "CONFIRMED" ||
          booking.status ===
            "COMPLETED"
      )
      .reduce(
        (sum, booking) =>
          sum +
          Number(
            booking.total || 0
          ),
        0
      );

  function handleSearchChange(
    value: string
  ) {
    setSearch(value);
    setCurrentPage(1);
  }

  function handleStatusChange(
    value: string
  ) {
    setStatus(
      value as
        | "ALL"
        | BookingStatus
    );

    setCurrentPage(1);
  }

function handleViewBooking(
  booking: Booking
) {
  const bookingId =
    booking._id || booking.id;

  if (!bookingId) {
    console.error(
      "Booking ID missing:",
      booking
    );

    setError(
      "Unable to open booking: booking ID is missing."
    );

    return;
  }

  console.log(
    "Opening booking:",
    bookingId
  );

  router.push(
    `/admin/bookings/${encodeURIComponent(
      String(bookingId)
    )}`
  );
}
  return (
    <div className="px-5 py-6 sm:px-6 lg:px-8">
      {/* HEADER */}

      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
            <CalendarDays className="h-4 w-4" />

            Reservations
          </div>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Bookings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Manage reservations, guest
            details, hotel stays and
            booking status from one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-700 transition hover:border-[#D4AF37]/40 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-200 dark:hover:bg-white/[0.06]"
          >
            <SlidersHorizontal className="h-4 w-4" />

            Filters
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total bookings"
          value={totalBookings}
          icon={CalendarDays}
        />

        <StatCard
          title="Confirmed"
          value={confirmedBookings}
          icon={CheckCircle2}
        />

        <StatCard
          title="Pending"
          value={pendingBookings}
          icon={Clock3}
        />

        <StatCard
          title="Revenue"
          value={formatCurrency(
            totalRevenue
          )}
          icon={Hotel}
        />
      </div>

      {/* TABLE CARD */}

      <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
        {/* TOOLBAR */}

        <div className="flex flex-col gap-4 border-b border-zinc-200 p-5 dark:border-white/10 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">
              All reservations
            </h2>

            <p className="mt-1 text-xs text-zinc-500">
              {loading
                ? "Loading..."
                : `${bookings.length} booking${
                    bookings.length !==
                    1
                      ? "s"
                      : ""
                  } found`}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {/* SEARCH */}

            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                value={search}
                onChange={(event) =>
                  handleSearchChange(
                    event.target.value
                  )
                }
                placeholder="Search bookings..."
                className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-zinc-600 sm:w-64"
              />
            </div>

            {/* STATUS */}

            <select
              value={status}
              onChange={(event) =>
                handleStatusChange(
                  event.target.value
                )
              }
              className="h-10 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-white/[0.03]"
            >
              <option value="ALL">
                All statuses
              </option>

              <option value="PENDING">
                Pending
              </option>

              <option value="CONFIRMED">
                Confirmed
              </option>

              <option value="COMPLETED">
                Completed
              </option>

              <option value="CANCELLED">
                Cancelled
              </option>
            </select>
          </div>
        </div>

        {/* ERROR */}

        {error && (
          <div className="border-b border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* LOADING */}

        {loading ? (
          <div className="flex min-h-[350px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-300 border-t-[#D4AF37]" />

              <p className="mt-4 text-sm text-zinc-500">
                Loading bookings...
              </p>
            </div>
          </div>
        ) : bookings.length ===
          0 ? (
          /* EMPTY STATE */

          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
              <AlertCircle className="h-6 w-6 text-zinc-500" />
            </div>

            <h3 className="mt-4 font-semibold">
              No bookings found
            </h3>

            <p className="mt-1 max-w-sm text-sm text-zinc-500">
              Try changing your search
              or status filter.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP TABLE */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-200 text-left text-xs uppercase tracking-wider text-zinc-500 dark:border-white/10">
                    <th className="px-6 py-4 font-semibold">
                      Booking
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Guest
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Hotel
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Stay
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Guests
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Total
                    </th>

                    <th className="px-6 py-4 font-semibold">
                      Status
                    </th>

                    <th className="px-6 py-4 text-right font-semibold">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {bookings.map(
                    (booking) => {
                      const config =
                        statusConfig[
                          booking.status
                        ];

                      const StatusIcon =
                        config.icon;

                      const guestName =
                        getGuestName(
                          booking
                        );

                      return (
                        <tr
                          key={
                            booking.id
                          }
                          className="border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/[0.025]"
                        >
                          {/* BOOKING */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-semibold">
                              {
                                booking.bookingReference
                              }
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {formatDate(
                                booking.checkIn
                              )}
                            </p>
                          </td>

                          {/* GUEST */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-medium">
                              {
                                guestName
                              }
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                booking
                                  .guest
                                  ?.email
                              }
                            </p>
                          </td>

                          {/* HOTEL */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-medium">
                              Hotel
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              Hotel ID:{" "}
                              {getShortId(
                                booking.hotelId
                              )}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              Room ID:{" "}
                              {getShortId(
                                booking.roomId
                              )}
                            </p>
                          </td>

                          {/* STAY */}

                          <td className="px-6 py-5">
                            <p className="text-xs text-zinc-500">
                              Check-in
                            </p>

                            <p className="text-sm font-medium">
                              {formatDate(
                                booking.checkIn
                              )}
                            </p>

                            <p className="mt-2 text-xs text-zinc-500">
                              Check-out
                            </p>

                            <p className="text-sm font-medium">
                              {formatDate(
                                booking.checkOut
                              )}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                booking.nights
                              }{" "}
                              night
                              {booking.nights !==
                              1
                                ? "s"
                                : ""}
                            </p>
                          </td>

                          {/* GUESTS */}

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-sm">
                              <Users className="h-4 w-4 text-zinc-500" />

                              {
                                booking.guests
                              }
                            </div>
                          </td>

                          {/* TOTAL */}

                          <td className="px-6 py-5">
                            <p className="text-sm font-bold">
                              {formatCurrency(
                                Number(
                                  booking.total ||
                                    0
                                )
                              )}
                            </p>

                            <p className="mt-1 text-xs uppercase text-zinc-500">
                              {
                                booking.paymentStatus
                              }
                            </p>
                          </td>

                          {/* STATUS */}

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${config.className}`}
                            >
                              <StatusIcon className="h-3.5 w-3.5" />

                              {
                                config.label
                              }
                            </span>
                          </td>

                          {/* ACTION */}

                          <td className="px-6 py-5 text-right">
                            <button
                              type="button"
                              onClick={() =>
                                handleViewBooking(booking)
                              }
                              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] dark:border-white/10"
                              aria-label={`View ${booking.bookingReference}`}
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE CARDS */}

            <div className="divide-y divide-zinc-100 md:hidden dark:divide-white/5">
              {bookings.map(
                (booking) => {
                  const config =
                    statusConfig[
                      booking.status
                    ];

                  const StatusIcon =
                    config.icon;

                  const guestName =
                    getGuestName(
                      booking
                    );

                  return (
                    <div
                      key={
                        booking.id
                      }
                      className="p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold">
                            {
                              booking.bookingReference
                            }
                          </p>

                          <p className="mt-1 truncate text-xs text-zinc-500">
                            {
                              guestName
                            }
                          </p>
                        </div>

                        <span
                          className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-1 text-[11px] font-semibold ${config.className}`}
                        >
                          <StatusIcon className="h-3 w-3" />

                          {
                            config.label
                          }
                        </span>
                      </div>

                      <div className="mt-5 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Hotel
                          </p>

                          <p className="mt-1 truncate text-sm font-medium">
                            Hotel
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Guests
                          </p>

                          <p className="mt-1 flex items-center gap-1 text-sm font-medium">
                            <Users className="h-3.5 w-3.5 text-zinc-500" />

                            {
                              booking.guests
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Check-in
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {formatDate(
                              booking.checkIn
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Check-out
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {formatDate(
                              booking.checkOut
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Nights
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              booking.nights
                            }
                          </p>
                        </div>

                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Payment
                          </p>

                          <p className="mt-1 text-sm font-medium">
                            {
                              booking.paymentStatus
                            }
                          </p>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4 dark:border-white/5">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-zinc-500">
                            Total
                          </p>

                          <p className="mt-1 text-base font-bold">
                            {formatCurrency(
                              Number(
                                booking.total ||
                                  0
                              )
                            )}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            handleViewBooking(booking)
                          }
                          className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-semibold transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] dark:border-white/10"
                        >
                          <Eye className="h-3.5 w-3.5" />

                          View
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}

        {/* PAGINATION */}

        {!loading &&
          pagination.totalPages >
            0 && (
            <div className="flex flex-col gap-4 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <p className="text-xs text-zinc-500">
                Showing{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {bookings.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                  {pagination.total}
                </span>{" "}
                bookings
              </p>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          1,
                          page - 1
                        )
                    )
                  }
                  disabled={
                    !pagination.hasPreviousPage
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 transition hover:border-[#D4AF37]/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>

                <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#D4AF37] px-2 text-xs font-bold text-black">
                  {pagination.page}
                </span>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        page + 1
                    )
                  }
                  disabled={
                    !pagination.hasNextPage
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-200 transition hover:border-[#D4AF37]/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  icon: typeof CalendarDays;
}) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#D4AF37]">
            <Icon className="h-5 w-5" />
          </div>

          <span className="text-xs text-zinc-500">
            BookingLK
          </span>
        </div>
      </div>

      <p className="mt-5 text-xs font-medium text-zinc-500">
        {title}
      </p>

      <p className="mt-1 text-2xl font-bold tracking-tight">
        {value}
      </p>
    </div>
  );
}

