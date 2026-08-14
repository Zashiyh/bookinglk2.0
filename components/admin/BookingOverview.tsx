"use client";

import {
  CheckCircle2,
  Clock3,
  XCircle,
} from "lucide-react";

interface BookingOverviewProps {
  pendingBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

export default function BookingOverview({
  pendingBookings,
  confirmedBookings,
  cancelledBookings,
}: BookingOverviewProps) {
  const items = [
    {
      title: "Pending bookings",
      value: pendingBookings,
      description: "Waiting for confirmation",
      icon: Clock3,
      wrapper: "border-amber-500/10 bg-amber-500/[0.04]",
      iconBox: "bg-amber-500/10 text-amber-500",
      valueClass: "text-amber-600 dark:text-amber-400",
    },
    {
      title: "Confirmed bookings",
      value: confirmedBookings,
      description: "Successfully confirmed",
      icon: CheckCircle2,
      wrapper: "border-emerald-500/10 bg-emerald-500/[0.04]",
      iconBox: "bg-emerald-500/10 text-emerald-500",
      valueClass: "text-emerald-600 dark:text-emerald-400",
    },
    {
      title: "Cancelled bookings",
      value: cancelledBookings,
      description: "Cancelled reservations",
      icon: XCircle,
      wrapper: "border-red-500/10 bg-red-500/[0.04]",
      iconBox: "bg-red-500/10 text-red-500",
      valueClass: "text-red-600 dark:text-red-400",
    },
  ];

  return (
    <section className="mt-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-white">
          Booking overview
        </h2>

        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Current reservation status across the platform.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className={`rounded-3xl border p-5 ${item.wrapper}`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-2xl ${item.iconBox}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                      {item.title}
                    </p>

                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                      {item.description}
                    </p>
                  </div>
                </div>

                <p
                  className={`text-2xl font-extrabold ${item.valueClass}`}
                >
                  {item.value.toLocaleString("en-LK")}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}