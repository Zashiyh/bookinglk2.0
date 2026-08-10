"use client";

import {
  motion,
} from "framer-motion";

import {
  Users,
  Building2,
  CalendarDays,
  WalletCards,
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

interface DashboardStatsProps {
  data: {
    users: {
      total: number;
    };

    hotels: {
      total: number;
    };

    bookings: {
      total: number;
      confirmed: number;
      pending: number;
      cancelled: number;
    };

    revenue: {
      total: number;
      currency: string;
    };
  };
}

const cards = [
  {
    key: "users",
    title: "Total Users",
    icon: Users,
  },
  {
    key: "hotels",
    title: "Total Hotels",
    icon: Building2,
  },
  {
    key: "bookings",
    title: "Total Bookings",
    icon: CalendarDays,
  },
  {
    key: "revenue",
    title: "Total Revenue",
    icon: WalletCards,
  },
] as const;

export default function DashboardStats({
  data,
}: DashboardStatsProps) {
  const values = {
    users: data.users.total,

    hotels: data.hotels.total,

    bookings: data.bookings.total,

    revenue: `LKR ${Number(
      data.revenue.total
    ).toLocaleString()}`,
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map(
        (
          card,
          index
        ) => {
          const Icon = card.icon;

          return (
            <motion.div
              key={card.key}
              initial={{
                opacity: 0,
                y: 18,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.4,
                delay:
                  index * 0.08,
              }}
              className="
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                border-zinc-200
                bg-white
                p-5
                shadow-sm
                transition
                hover:-translate-y-1
                hover:shadow-xl
                dark:border-white/10
                dark:bg-[#111111]
              "
            >
              <div
                className="
                  absolute
                  -right-10
                  -top-10
                  h-28
                  w-28
                  rounded-full
                  bg-[#D4AF37]/10
                  blur-2xl
                "
              />

              <div className="relative">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      {card.title}
                    </p>

                    <p className="mt-3 text-2xl font-bold tracking-tight">
                      {values[card.key]}
                    </p>
                  </div>

                  <div
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#D4AF37]/10
                      text-[#D4AF37]
                    "
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        }
      )}

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.32,
        }}
        className="rounded-3xl border border-emerald-500/10 bg-white p-5 dark:bg-[#111111]"
      >
        <div className="flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />

          <div>
            <p className="text-xs text-zinc-500">
              Confirmed
            </p>

            <p className="text-xl font-bold">
              {data.bookings.confirmed}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.4,
        }}
        className="rounded-3xl border border-amber-500/10 bg-white p-5 dark:bg-[#111111]"
      >
        <div className="flex items-center gap-3">
          <Clock3 className="h-5 w-5 text-amber-500" />

          <div>
            <p className="text-xs text-zinc-500">
              Pending
            </p>

            <p className="text-xl font-bold">
              {data.bookings.pending}
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.4,
          delay: 0.48,
        }}
        className="rounded-3xl border border-red-500/10 bg-white p-5 dark:bg-[#111111]"
      >
        <div className="flex items-center gap-3">
          <XCircle className="h-5 w-5 text-red-500" />

          <div>
            <p className="text-xs text-zinc-500">
              Cancelled
            </p>

            <p className="text-xl font-bold">
              {data.bookings.cancelled}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}