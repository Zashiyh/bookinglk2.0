"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
  AlertCircle,
  ArrowUpRight,
  Building2,
  CalendarCheck,
  CheckCircle2,
  Clock3,
  Hotel,
  Loader2,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";

interface DashboardStats {
  totalUsers: number;
  totalHotels: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

interface RecentBooking {
  _id: string;
  bookingReference: string;

  guest?: {
    firstName?: string;
    lastName?: string;
    email?: string;
  };

  hotelId?: {
    _id?: string;
    name?: string;
    location?: {
      city?: string;
    };
  };

  checkIn: string;
  checkOut: string;

  total: number;
  currency: string;

  status:
    | "PENDING"
    | "CONFIRMED"
    | "CANCELLED"
    | "COMPLETED";

  paymentStatus:
    | "PENDING"
    | "PAID"
    | "FAILED"
    | "REFUNDED";

  createdAt: string;
}

interface DashboardResponse {
  success: boolean;

  message?: string;

  data?: {
    stats: DashboardStats;
    recentBookings: RecentBooking[];
  };
}

function formatCurrency(
  value: number
) {
  return new Intl.NumberFormat(
    "en-LK",
    {
      style: "currency",
      currency: "LKR",
      maximumFractionDigits: 0,
    }
  ).format(value);
}

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat(
    "en-LK",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }
  ).format(new Date(value));
}

function statusClasses(
  status: string
) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

    case "COMPLETED":
      return "bg-blue-500/10 text-blue-400 border-blue-500/20";

    case "CANCELLED":
      return "bg-red-500/10 text-red-400 border-red-500/20";

    default:
      return "bg-amber-500/10 text-amber-400 border-amber-500/20";
  }
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: typeof Users;
}) {
  return (
    <div className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            {value}
          </h3>

          <p className="mt-2 text-xs text-zinc-500">
            {subtitle}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] transition-transform duration-300 group-hover:scale-110">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<DashboardStats | null>(null);

  const [recentBookings, setRecentBookings] =
    useState<RecentBooking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/dashboard",
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          }
        );

        const text =
          await response.text();

        let result: DashboardResponse =
          {
            success: false,
          };

        if (text.trim()) {
          try {
            result = JSON.parse(text);
          } catch {
            throw new Error(
              "Server returned invalid JSON."
            );
          }
        }

        if (!response.ok) {
          throw new Error(
            result.message ||
              `Unable to load dashboard (${response.status}).`
          );
        }

        if (
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.message ||
              "Unable to load dashboard."
          );
        }

        if (!active) return;

        setStats(result.data.stats);

        setRecentBookings(
          result.data.recentBookings || []
        );
      } catch (error) {
        console.error(
          "ADMIN_DASHBOARD_ERROR:",
          error
        );

        if (!active) return;

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-5rem)] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-[#D4AF37]" />

          <p className="text-sm text-zinc-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mx-auto flex max-w-2xl items-center gap-4 rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>

          <div>
            <h2 className="font-semibold text-zinc-900 dark:text-white">
              Dashboard unavailable
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="min-h-full p-6 lg:p-8">
      <div className="mx-auto max-w-[1600px]">
        {/* HEADER */}

        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#D4AF37]">
              Overview
            </p>

            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500">
              Monitor your BookingLK platform.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-xs text-zinc-500 dark:border-white/10 dark:bg-[#111]">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            System operational
          </div>
        </div>

        {/* STATS */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            subtitle="Registered customers"
            icon={Users}
          />

          <StatCard
            title="Hotels"
            value={stats.totalHotels}
            subtitle="Properties on platform"
            icon={Building2}
          />

          <StatCard
            title="Bookings"
            value={stats.totalBookings}
            subtitle={`${stats.confirmedBookings} confirmed`}
            icon={CalendarCheck}
          />

          <StatCard
            title="Revenue"
            value={formatCurrency(
              stats.revenue
            )}
            subtitle="Paid bookings"
            icon={Wallet}
          />
        </div>

        {/* SECONDARY STATS */}

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
                <Clock3 className="h-5 w-5 text-amber-400" />
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Pending
                </p>

                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  {stats.pendingBookings}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Confirmed
                </p>

                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  {stats.confirmedBookings}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-[#111]">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>

              <div>
                <p className="text-xs text-zinc-500">
                  Cancelled
                </p>

                <p className="text-xl font-bold text-zinc-900 dark:text-white">
                  {stats.cancelledBookings}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RECENT BOOKINGS */}

        <div className="mt-8 overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#111]">
          <div className="flex flex-col justify-between gap-3 border-b border-zinc-200 p-5 sm:flex-row sm:items-center dark:border-white/10">
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white">
                Recent Bookings
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                Latest reservations across BookingLK.
              </p>
            </div>

           <Link
  href="/admin/bookings"
  className="inline-flex items-center gap-1 text-sm font-semibold text-[#D4AF37] transition-colors hover:text-[#F5D76E]"
>
  View all
  <span aria-hidden="true">→</span>
</Link>
          </div>

          {recentBookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-100 dark:bg-white/5">
                <Hotel className="h-6 w-6 text-zinc-400" />
              </div>

              <h3 className="mt-4 font-semibold text-zinc-900 dark:text-white">
                No bookings yet
              </h3>

              <p className="mt-1 text-sm text-zinc-500">
                New bookings will appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs text-zinc-500 dark:border-white/10">
                    <th className="px-5 py-4 font-medium">
                      Booking
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Guest
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Hotel
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Date
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Amount
                    </th>

                    <th className="px-5 py-4 font-medium">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map(
                    (booking) => {
                      const guestName =
                        `${booking.guest?.firstName || ""} ${
                          booking.guest?.lastName || ""
                        }`.trim() ||
                        "Guest";

                      return (
                        <tr
                          key={booking._id}
                          className="border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/[0.02]"
                        >
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                              {
                                booking.bookingReference
                              }
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {formatDate(
                                booking.createdAt
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">
                              {guestName}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                booking.guest
                                  ?.email
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-medium text-zinc-900 dark:text-white">
                              {
                                booking.hotelId
                                  ?.name
                              }
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                booking.hotelId
                                  ?.location
                                  ?.city
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                              {formatDate(
                                booking.checkIn
                              )}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              to{" "}
                              {formatDate(
                                booking.checkOut
                              )}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <p className="text-sm font-bold text-zinc-900 dark:text-white">
                              {formatCurrency(
                                booking.total
                              )}
                            </p>

                            <p className="mt-1 text-xs text-zinc-500">
                              {
                                booking.paymentStatus
                              }
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusClasses(
                                booking.status
                              )}`}
                            >
                              {booking.status}
                            </span>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}