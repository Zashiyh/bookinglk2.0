
"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  DollarSign,
  Users,
} from "lucide-react";

interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalHotels: number;
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

const emptyStats: AdminStats = {
  totalUsers: 0,
  totalAdmins: 0,
  totalHotels: 0,
  totalBookings: 0,
  confirmedBookings: 0,
  cancelledBookings: 0,
  revenue: 0,
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-LK").format(value);
}

export default function AdminDashboard() {
  const [stats, setStats] =
    useState<AdminStats>(emptyStats);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const response = await fetch(
          "/api/admin/stats",
          {
            method: "GET",
            cache: "no-store",
            credentials: "include",
          }
        );

        const result =
          await response.json();

        if (
          response.ok &&
          result.success &&
          result.data
        ) {
          setStats(result.data);
        }
      } catch (error) {
        console.error(
          "DASHBOARD_STATS_ERROR:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadStats();
  }, []);

  const cards = [
    {
      label: "Total users",
      value: stats.totalUsers,
      icon: Users,
    },
    {
      label: "Total hotels",
      value: stats.totalHotels,
      icon: Building2,
    },
    {
      label: "Total bookings",
      value: stats.totalBookings,
      icon: CalendarCheck,
    },
    {
      label: "Revenue",
      value: `LKR ${formatPrice(
        stats.revenue
      )}`,
      icon: DollarSign,
    },
  ];

  return (
    <main className="min-h-[calc(100vh-5rem)] bg-[#f8f8f6] px-4 py-6 text-zinc-900 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">

        {/* Header */}
        <section className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#B8860B] dark:text-[#F5D76E]">
            Overview
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Dashboard
          </h1>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your BookingLK platform
            from one place.
          </p>
        </section>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                    <Icon className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-zinc-400 transition group-hover:text-[#D4AF37]" />
                </div>

                <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                  {card.label}
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {loading
                    ? "—"
                    : card.value}
                </p>
              </div>
            );
          })}
        </section>

        {/* Main sections */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* Booking overview */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Booking overview
                </h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Current booking statistics
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <CalendarCheck className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
              </div>
            </div>

            <div className="mt-6 space-y-4">

              {/* Confirmed */}
              <div className="flex items-center justify-between rounded-2xl bg-emerald-500/5 p-4">
                <div>
                  <p className="text-sm font-medium">
                    Confirmed bookings
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Successfully confirmed reservations
                  </p>
                </div>

                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {loading
                    ? "—"
                    : stats.confirmedBookings}
                </span>
              </div>

              {/* Cancelled */}
              <div className="flex items-center justify-between rounded-2xl bg-red-500/5 p-4">
                <div>
                  <p className="text-sm font-medium">
                    Cancelled bookings
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                    Cancelled reservations
                  </p>
                </div>

                <span className="font-bold text-red-600 dark:text-red-400">
                  {loading
                    ? "—"
                    : stats.cancelledBookings}
                </span>
              </div>

            </div>
          </div>

          {/* Platform information */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  Platform information
                </h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  BookingLK platform statistics
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
                <Building2 className="h-5 w-5 text-blue-500" />
              </div>
            </div>

            <div className="mt-6 space-y-4 text-sm">

              {/* Users */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Registered users
                </span>

                <span className="font-semibold">
                  {loading
                    ? "—"
                    : stats.totalUsers}
                </span>
              </div>

              {/* Admins */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Administrators
                </span>

                <span className="font-semibold">
                  {loading
                    ? "—"
                    : stats.totalAdmins}
                </span>
              </div>

              {/* Hotels */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Properties
                </span>

                <span className="font-semibold">
                  {loading
                    ? "—"
                    : stats.totalHotels}
                </span>
              </div>

              {/* Bookings */}
              <div className="flex items-center justify-between">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Total bookings
                </span>

                <span className="font-semibold">
                  {loading
                    ? "—"
                    : stats.totalBookings}
                </span>
              </div>

              {/* Revenue */}
              <div className="flex items-center justify-between border-t border-zinc-200 pt-4 dark:border-white/10">
                <span className="text-zinc-500 dark:text-zinc-400">
                  Platform revenue
                </span>

                <span className="font-bold">
                  {loading
                    ? "—"
                    : `LKR ${formatPrice(
                        stats.revenue
                      )}`}
                </span>
              </div>

            </div>
          </div>

        </section>

        {/* Quick actions */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <a
            href="/admin/hotels"
            className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
          >
            <Building2 className="h-6 w-6 text-[#B8860B] dark:text-[#F5D76E]" />

            <h3 className="mt-4 font-semibold">
              Manage Hotels
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Add and manage hotel properties.
            </p>

            <ArrowUpRight className="mt-4 h-4 w-4 text-zinc-400 transition group-hover:text-[#D4AF37]" />
          </a>

          <a
            href="/admin/users"
            className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
          >
            <Users className="h-6 w-6 text-blue-500" />

            <h3 className="mt-4 font-semibold">
              Manage Users
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              Manage users and administrators.
            </p>

            <ArrowUpRight className="mt-4 h-4 w-4 text-zinc-400 transition group-hover:text-[#D4AF37]" />
          </a>

          <a
            href="/admin/bookings"
            className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
          >
            <CalendarCheck className="h-6 w-6 text-purple-500" />

            <h3 className="mt-4 font-semibold">
              Manage Bookings
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              View and manage reservations.
            </p>

            <ArrowUpRight className="mt-4 h-4 w-4 text-zinc-400 transition group-hover:text-[#D4AF37]" />
          </a>

          <a
            href="/admin/revenue"
            className="group rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/50 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
          >
            <DollarSign className="h-6 w-6 text-emerald-500" />

            <h3 className="mt-4 font-semibold">
              Revenue
            </h3>

            <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
              View platform revenue.
            </p>

            <ArrowUpRight className="mt-4 h-4 w-4 text-zinc-400 transition group-hover:text-[#D4AF37]" />
          </a>

        </section>

      </div>
    </main>
  );
}

