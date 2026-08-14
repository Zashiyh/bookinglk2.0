"use client";

import Link from "next/link";
import {
  ArrowUpRight,
  Building2,
  CalendarCheck,
  DollarSign,
  Users,
} from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      href: "/admin/hotels",
      title: "Manage Hotels",
      description: "Add and manage properties.",
      icon: Building2,
      iconClass: "text-[#B8860B] dark:text-[#F5D76E]",
      bgClass: "bg-[#D4AF37]/10",
    },
    {
      href: "/admin/users",
      title: "Manage Users",
      description: "Users and administrators.",
      icon: Users,
      iconClass: "text-blue-500",
      bgClass: "bg-blue-500/10",
    },
    {
      href: "/admin/bookings",
      title: "Manage Bookings",
      description: "View and manage reservations.",
      icon: CalendarCheck,
      iconClass: "text-purple-500",
      bgClass: "bg-purple-500/10",
    },
    {
      href: "/admin/revenue",
      title: "Revenue",
      description: "View platform revenue.",
      icon: DollarSign,
      iconClass: "text-emerald-500",
      bgClass: "bg-emerald-500/10",
    },
  ];

  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-[#111]">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
        Quick actions
      </p>

      <h2 className="mt-2 text-xl font-bold text-zinc-900 dark:text-white">
        Manage BookingLK
      </h2>

      <div className="mt-5 space-y-3">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <Link
              key={action.href}
              href={action.href}
              className="group flex items-center gap-3 rounded-2xl border border-zinc-200 p-4 transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/5 dark:border-white/10 dark:hover:bg-white/[0.03]"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${action.bgClass}`}
              >
                <Icon className={`h-5 w-5 ${action.iconClass}`} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {action.title}
                </p>

                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">
                  {action.description}
                </p>
              </div>

              <ArrowUpRight className="h-4 w-4 text-zinc-400 transition group-hover:text-[#D4AF37]" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}