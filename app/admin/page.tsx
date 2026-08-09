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
  return new Intl.NumberFormat("en-LK").format(
    value
  );
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
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (
          response.ok &&
          result.success
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
    <div className="mx-auto max-w-[1600px] p-5 sm:p-8">
      <section>
        <div className="mb-8">
          <p className="text-sm font-medium text-[#B8860B] dark:text-[#F5D76E]">
            Overview
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight">
            Dashboard
          </h2>

          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
            Manage your BookingLK platform
            from one place.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.label}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                    <Icon className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
                  </div>

                  <ArrowUpRight className="h-4 w-4 text-zinc-400" />
                </div>

                <p className="mt-6 text-sm text-zinc-500">
                  {card.label}
                </p>

                <p className="mt-1 text-2xl font-bold">
                  {loading ? "—" : card.value}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <h3 className="text-lg font-semibold">
            Booking overview
          </h3>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-2xl bg-emerald-500/5 p-4">
              <span className="text-sm text-zinc-500">
                Confirmed bookings
              </span>

              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {stats.confirmedBookings}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-2xl bg-red-500/5 p-4">
              <span className="text-sm text-zinc-500">
                Cancelled bookings
              </span>

              <span className="font-bold text-red-600 dark:text-red-400">
                {stats.cancelledBookings}
              </span>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111]">
          <h3 className="text-lg font-semibold">
            Platform information
          </h3>

          <div className="mt-6 space-y-4 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">
                Registered users
              </span>

              <span className="font-semibold">
                {stats.totalUsers}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">
                Administrators
              </span>

              <span className="font-semibold">
                {stats.totalAdmins}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-zinc-500">
                Properties
              </span>

              <span className="font-semibold">
                {stats.totalHotels}
              </span>
            </div>

            <div className="flex justify-between border-t border-zinc-200 pt-4 dark:border-white/10">
              <span className="text-zinc-500">
                Platform revenue
              </span>

              <span className="font-bold">
                LKR{" "}
                {formatPrice(stats.revenue)}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}