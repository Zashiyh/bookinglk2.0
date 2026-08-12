"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Building2,
  CalendarDays,
  Hotel,
  LogOut,
  Settings,
  Tag,
  Users,
} from "lucide-react";

const items = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    label: "Hotels",
    href: "/admin/hotels",
    icon: Building2,
  },
  {
    label: "Rooms",
    href: "/admin/rooms",
    icon: Hotel,
  },
  {
    label: "Bookings",
    href: "/admin/bookings",
    icon: CalendarDays,
  },
  {
    label: "Deals",
    href: "/admin/deals",
    icon: Tag,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  async function logout() {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
    }

    window.location.href = "/login";
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-zinc-200 bg-white lg:flex lg:flex-col dark:border-white/10 dark:bg-[#0b0b0b]">
      {/* LOGO */}
      <div className="flex h-20 items-center border-b border-zinc-200 px-6 dark:border-white/10">
        <Link
          href="/admin"
          className="text-xl font-extrabold tracking-tight"
        >
          Booking
          <span className="text-[#D4AF37]">
            LK
          </span>

          <span className="ml-2 text-xs font-medium text-zinc-400">
            ADMIN
          </span>
        </Link>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {items.map((item) => {
          const Icon = item.icon;

          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                active
                  ? "bg-[#D4AF37]/10 text-[#B8860B] dark:text-[#F5D76E]"
                  : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white"
              }`}
            >
              <Icon
                className={`h-[18px] w-[18px] transition-transform duration-200 ${
                  active
                    ? "scale-105"
                    : "group-hover:scale-105"
                }`}
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="border-t border-zinc-200 p-4 dark:border-white/10">
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-zinc-500 transition hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-[18px] w-[18px]" />

          Logout
        </button>
      </div>
    </aside>
  );
}