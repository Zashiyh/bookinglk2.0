"use client";

import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  DollarSign,
  Users,
} from "lucide-react";

export interface AdminStats {
  totalUsers: number;
  totalAdmins: number;
  totalHotels: number;
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  revenue: number;
}

interface DashboardStatsProps {
  stats: AdminStats;
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  description: string;
  icon: typeof Users;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#111]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#D4AF37]/5 blur-2xl transition-all duration-300 group-hover:bg-[#D4AF37]/10" />

      <div className="relative">
        <div className="flex items-start justify-between">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]">
            <Icon className="h-5 w-5" />
          </div>

          <ArrowUpRight className="h-4 w-4 text-zinc-400 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[#D4AF37]" />
        </div>

        <p className="mt-6 text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {label}
        </p>

        <p className="mt-2 text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-white">
          {value}
        </p>

        <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-500">
          {description}
        </p>
      </div>
    </div>
  );
}

export default function DashboardStats({
  stats,
}: DashboardStatsProps) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total users"
        value={stats.totalUsers}
        description="Registered customers"
        icon={Users}
      />

      <StatCard
        label="Total hotels"
        value={stats.totalHotels}
        description="Properties on BookingLK"
        icon={Building2}
      />

      <StatCard
        label="Total bookings"
        value={stats.totalBookings}
        description={`${stats.confirmedBookings} confirmed reservations`}
        icon={CalendarCheck}
      />

      <StatCard
        label="Platform revenue"
        value={formatCurrency(stats.revenue)}
        description="Revenue from confirmed bookings"
        icon={DollarSign}
      />
    </section>
  );
}