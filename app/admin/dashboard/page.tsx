"use client";

import {
  ArrowUpRight,
  BedDouble,
  CalendarDays,
  ChevronRight,
  Hotel,
  MoreHorizontal,
  TrendingUp,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "1,248",
    change: "+12.5%",
    icon: Users,
  },
  {
    title: "Total Hotels",
    value: "186",
    change: "+8.2%",
    icon: Hotel,
  },
  {
    title: "Total Rooms",
    value: "742",
    change: "+14.3%",
    icon: BedDouble,
  },
  {
    title: "Total Bookings",
    value: "3,842",
    change: "+18.7%",
    icon: CalendarDays,
  },
];

const recentBookings = [
  {
    id: "BLK-92831",
    guest: "Kasun Perera",
    hotel: "Cinnamon Grand Colombo",
    date: "Aug 10, 2026",
    amount: "LKR 42,500",
    status: "CONFIRMED",
  },
  {
    id: "BLK-92830",
    guest: "Nimal Fernando",
    hotel: "The Grand Kandyan",
    date: "Aug 10, 2026",
    amount: "LKR 28,000",
    status: "PENDING",
  },
  {
    id: "BLK-92829",
    guest: "Amaya Silva",
    hotel: "Jetwing Blue",
    date: "Aug 9, 2026",
    amount: "LKR 36,750",
    status: "CONFIRMED",
  },
  {
    id: "BLK-92828",
    guest: "Daniel Wilson",
    hotel: "Shangri-La Colombo",
    date: "Aug 9, 2026",
    amount: "LKR 67,500",
    status: "CONFIRMED",
  },
  {
    id: "BLK-92827",
    guest: "Tharushi Perera",
    hotel: "Araliya Green City",
    date: "Aug 8, 2026",
    amount: "LKR 21,400",
    status: "CANCELLED",
  },
];

const recentUsers = [
  {
    name: "Kasun Perera",
    email: "kasun@example.com",
    role: "USER",
  },
  {
    name: "Amaya Silva",
    email: "amaya@example.com",
    role: "USER",
  },
  {
    name: "Hotel Manager",
    email: "manager@hotel.com",
    role: "HOTEL_MANAGER",
  },
  {
    name: "Nimal Fernando",
    email: "nimal@example.com",
    role: "USER",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getStatusClass(status: string) {
  switch (status) {
    case "CONFIRMED":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";

    case "PENDING":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400";

    case "CANCELLED":
      return "bg-red-500/10 text-red-600 dark:text-red-400";

    default:
      return "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400";
  }
}

export default function AdminDashboardPage() {
  return (
    <main className="min-h-screen bg-[#f8f8f6] px-4 py-6 text-zinc-900 dark:bg-[#080808] dark:text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1600px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
              <span>Admin</span>
              <ChevronRight className="h-4 w-4" />
              <span>Dashboard</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              Welcome back, Super Admin. Here's what's happening with
              BookingLK.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm shadow-sm dark:border-white/10 dark:bg-[#111111]">
              <span className="text-zinc-500 dark:text-zinc-400">
                Today
              </span>
              <span className="ml-2 font-semibold">Aug 10, 2026</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;

            return (
              <div
                key={stat.title}
                className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-[#111111]"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                    <Icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>

                  <button
                    type="button"
                    className="rounded-xl p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-white"
                  >
                    <MoreHorizontal className="h-5 w-5" />
                  </button>
                </div>

                <p className="mt-6 text-sm text-zinc-500 dark:text-zinc-400">
                  {stat.title}
                </p>

                <div className="mt-1 flex items-end justify-between gap-3">
                  <p className="text-3xl font-bold tracking-tight">
                    {stat.value}
                  </p>

                  <span className="mb-1 flex items-center gap-1 text-xs font-semibold text-emerald-500">
                    <TrendingUp className="h-3.5 w-3.5" />
                    {stat.change}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Main grid */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* Revenue */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Revenue Overview</h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Booking revenue for the last 7 months
                </p>
              </div>

              <select
                defaultValue="7"
                className="rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm outline-none dark:border-white/10 dark:bg-[#161616]"
              >
                <option value="7">Last 7 months</option>
                <option value="30">Last 30 days</option>
                <option value="12">Last 12 months</option>
              </select>
            </div>

            <div className="mt-8 flex h-64 items-end gap-3 sm:gap-5">
              {[
                ["Feb", 42],
                ["Mar", 55],
                ["Apr", 48],
                ["May", 68],
                ["Jun", 61],
                ["Jul", 82],
                ["Aug", 94],
              ].map(([month, height]) => (
                <div
                  key={month}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >
                  <div className="flex h-full w-full items-end">
                    <div
                      className="w-full rounded-t-xl bg-gradient-to-t from-[#B8860B] to-[#F5D76E] transition-all duration-500 hover:opacity-80"
                      style={{
                        height: `${height}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs text-zinc-400">
                    {month}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-zinc-200 pt-5 dark:border-white/10">
              <div>
                <p className="text-xs text-zinc-500">Total revenue</p>
                <p className="mt-1 text-2xl font-bold">LKR 8.42M</p>
              </div>

              <div className="text-right">
                <p className="text-xs text-zinc-500">Growth</p>
                <p className="mt-1 font-semibold text-emerald-500">
                  +18.7%
                </p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-8">
            <h2 className="text-xl font-semibold">Quick Actions</h2>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Manage the BookingLK platform
            </p>

            <div className="mt-6 space-y-3">
              <a
                href="/admin/hotels"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 dark:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                    <Hotel className="h-5 w-5 text-[#D4AF37]" />
                  </div>

                  <div>
                    <p className="font-semibold">Manage Hotels</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Add, edit or remove hotels
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-5 w-5 text-zinc-400 transition group-hover:text-[#D4AF37]" />
              </a>

              <a
                href="/admin/users"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 dark:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                    <Users className="h-5 w-5 text-blue-500" />
                  </div>

                  <div>
                    <p className="font-semibold">Manage Users</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Users and staff accounts
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-5 w-5 text-zinc-400 transition group-hover:text-[#D4AF37]" />
              </a>

              <a
                href="/admin/bookings"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 dark:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10">
                    <CalendarDays className="h-5 w-5 text-purple-500" />
                  </div>

                  <div>
                    <p className="font-semibold">Manage Bookings</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      View and manage reservations
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-5 w-5 text-zinc-400 transition group-hover:text-[#D4AF37]" />
              </a>

              <a
                href="/admin/rooms"
                className="group flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-[#D4AF37]/50 hover:bg-[#D4AF37]/5 dark:border-white/10"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10">
                    <BedDouble className="h-5 w-5 text-emerald-500" />
                  </div>

                  <div>
                    <p className="font-semibold">Manage Rooms</p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      Rooms, pricing and availability
                    </p>
                  </div>
                </div>

                <ArrowUpRight className="h-5 w-5 text-zinc-400 transition group-hover:text-[#D4AF37]" />
              </a>
            </div>
          </div>
        </section>

        {/* Bottom grid */}
        <section className="mt-6 grid gap-6 xl:grid-cols-[1.7fr_1fr]">
          {/* Recent bookings */}
          <div className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
            <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-white/10">
              <div>
                <h2 className="text-xl font-semibold">Recent Bookings</h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Latest reservations across BookingLK
                </p>
              </div>

              <a
                href="/admin/bookings"
                className="flex items-center gap-1 text-sm font-semibold text-[#B8860B] hover:text-[#D4AF37]"
              >
                View all
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] text-left">
                <thead>
                  <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-400 dark:border-white/10">
                    <th className="px-6 py-4 font-medium">Booking</th>
                    <th className="px-6 py-4 font-medium">Guest</th>
                    <th className="px-6 py-4 font-medium">Hotel</th>
                    <th className="px-6 py-4 font-medium">Amount</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentBookings.map((booking) => (
                    <tr
                      key={booking.id}
                      className="border-b border-zinc-100 transition hover:bg-zinc-50 dark:border-white/5 dark:hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-5">
                        <p className="font-semibold">{booking.id}</p>
                        <p className="mt-1 text-xs text-zinc-400">
                          {booking.date}
                        </p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="font-medium">{booking.guest}</p>
                      </td>

                      <td className="px-6 py-5">
                        <p className="max-w-[220px] truncate text-sm text-zinc-500 dark:text-zinc-400">
                          {booking.hotel}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-semibold">
                        {booking.amount}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusClass(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent users */}
          <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#111111]">
            <div className="flex items-center justify-between border-b border-zinc-200 p-6 dark:border-white/10">
              <div>
                <h2 className="text-xl font-semibold">New Users</h2>

                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  Recently registered accounts
                </p>
              </div>

              <a
                href="/admin/users"
                className="text-sm font-semibold text-[#B8860B] hover:text-[#D4AF37]"
              >
                View all
              </a>
            </div>

            <div className="divide-y divide-zinc-100 dark:divide-white/5">
              {recentUsers.map((user) => (
                <div
                  key={user.email}
                  className="flex items-center gap-4 p-5"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-sm font-bold text-[#B8860B]">
                    {getInitials(user.name)}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold">{user.name}</p>

                    <p className="mt-0.5 truncate text-xs text-zinc-500 dark:text-zinc-400">
                      {user.email}
                    </p>
                  </div>

                  <span className="hidden rounded-full bg-zinc-100 px-2.5 py-1 text-[10px] font-semibold text-zinc-500 dark:bg-white/5 sm:block">
                    {user.role}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}