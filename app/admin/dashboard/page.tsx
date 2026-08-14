"use client";

import { useCallback, useEffect, useState } from "react";
import {
  RefreshCw,
  XCircle,
} from "lucide-react";

import DashboardStats, {
  AdminStats,
} from "@/components/admin/DashboardStats";

import BookingOverview from "@/components/admin/BookingOverview";

import DashboardSkeleton from "@/components/admin/DashboardSkeleton";

import RecentBookings, {
  RecentBooking,
} from "@/components/admin/RecentBookings";

import QuickActions from "@/components/admin/QuickActions";

const EMPTY_STATS: AdminStats = {
  totalUsers: 0,
  totalAdmins: 0,
  totalHotels: 0,
  totalBookings: 0,
  pendingBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  revenue: 0,
};

interface ApiResponse {
  success?: boolean;
  message?: string;

  data?: {
    stats?: Partial<AdminStats>;
    recentBookings?: RecentBooking[];
  };
}

function safeNumber(
  value: unknown
): number {
  if (
    typeof value === "number" &&
    Number.isFinite(value)
  ) {
    return value;
  }

  if (
    typeof value === "string" &&
    value.trim() !== ""
  ) {
    const parsed = Number(
      value.replace(/,/g, "")
    );

    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return 0;
}

export default function AdminDashboardPage() {
  const [stats, setStats] =
    useState<AdminStats>(EMPTY_STATS);

  const [
    recentBookings,
    setRecentBookings,
  ] = useState<RecentBooking[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const loadDashboard =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/stats",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",

            headers: {
              Accept:
                "application/json",
            },
          }
        );

        const text =
          await response.text();

        let result: ApiResponse = {
          success: false,
        };

        if (text.trim()) {
          try {
            result =
              JSON.parse(text);
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

        if (!result.success) {
          throw new Error(
            result.message ||
              "Unable to load dashboard."
          );
        }

        const data =
          result.data ?? {};

        const apiStats =
          data.stats ?? {};

        const normalizedStats: AdminStats =
          {
            totalUsers: safeNumber(
              apiStats.totalUsers
            ),

            totalAdmins: safeNumber(
              apiStats.totalAdmins
            ),

            totalHotels: safeNumber(
              apiStats.totalHotels
            ),

            totalBookings: safeNumber(
              apiStats.totalBookings
            ),

            pendingBookings:
              safeNumber(
                apiStats.pendingBookings
              ),

            confirmedBookings:
              safeNumber(
                apiStats.confirmedBookings
              ),

            cancelledBookings:
              safeNumber(
                apiStats.cancelledBookings
              ),

            revenue: safeNumber(
              apiStats.revenue
            ),
          };

        setStats(
          normalizedStats
        );

        setRecentBookings(
          Array.isArray(
            data.recentBookings
          )
            ? data.recentBookings
            : []
        );
      } catch (error) {
        console.error(
          "ADMIN_DASHBOARD_ERROR:",
          error
        );

        setError(
          error instanceof Error
            ? error.message
            : "Unable to load dashboard."
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // --------------------------------------------------
  // LOADING
  // --------------------------------------------------

  if (loading) {
    return <DashboardSkeleton />;
  }

  // --------------------------------------------------
  // ERROR
  // --------------------------------------------------

  if (error) {
    return (
      <main className="min-h-[calc(100vh-5rem)] bg-[#f8f8f6] px-4 py-6 dark:bg-[#080808] sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-6">
            <div className="flex items-start gap-4">

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
                <XCircle className="h-5 w-5 text-red-500" />
              </div>

              <div className="flex-1">

                <h2 className="font-bold text-zinc-900 dark:text-white">
                  Dashboard unavailable
                </h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={
                    loadDashboard
                  }
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[#E5C158]"
                >
                  <RefreshCw className="h-4 w-4" />

                  Try again
                </button>

              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // DASHBOARD
  // --------------------------------------------------

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f8f6] px-4 py-6 text-zinc-900 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8 lg:py-8">

      <div className="mx-auto max-w-[1600px]">

        {/* HEADER */}

        <section className="mb-8">

          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">

            <div>

              <div className="flex items-center gap-2">

                <span className="h-2 w-2 rounded-full bg-emerald-400" />

                <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#B8860B] dark:text-[#F5D76E]">
                  Admin overview
                </p>

              </div>

              <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Dashboard
              </h1>

              <p className="mt-2 max-w-xl text-sm text-zinc-500 dark:text-zinc-400">
                Manage and monitor your BookingLK platform from one place.
              </p>

            </div>

            <button
              type="button"
              onClick={
                loadDashboard
              }
              className="inline-flex w-fit items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium text-zinc-600 transition hover:border-[#D4AF37]/40 hover:text-[#B8860B] dark:border-white/10 dark:bg-[#111] dark:text-zinc-300 dark:hover:text-[#F5D76E]"
            >

              <RefreshCw className="h-4 w-4" />

              Refresh

            </button>

          </div>

        </section>

        {/* REAL DATABASE STATS */}

        <DashboardStats
          stats={stats}
        />

        {/* REAL BOOKING STATUS */}

        <BookingOverview
          pendingBookings={
            stats.pendingBookings
          }
          confirmedBookings={
            stats.confirmedBookings
          }
          cancelledBookings={
            stats.cancelledBookings
          }
        />

        {/* REAL RECENT BOOKINGS */}

        <RecentBookings
          bookings={
            recentBookings
          }
        />

        {/* QUICK ACTIONS */}

        <section className="mt-6">
          <QuickActions />
        </section>

      </div>
    </main>
  );
}