"use client";

import { useEffect, useState } from "react";
import {
  Bell,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN";
}

export default function AdminNavbar() {
  const [user, setUser] =
    useState<AdminUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (
          response.ok &&
          result.success
        ) {
          setUser(result.data);
        }
      } catch (error) {
        console.error(
          "ADMIN_USER_ERROR:",
          error
        );
      }
    }

    loadUser();
  }, []);

  const firstName =
    user?.firstName || "Admin";

  const initials =
    `${user?.firstName?.charAt(0) ?? "A"}${
      user?.lastName?.charAt(0) ?? ""
    }`.toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0b0b0b]/90">
      <div className="flex h-20 items-center justify-between px-5 sm:px-8">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
            Administration
          </p>

          <h1 className="mt-1 text-lg font-bold">
            BookingLK Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5">
            <Bell className="h-4 w-4" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          </button>

          <div className="hidden h-8 w-px bg-zinc-200 dark:bg-white/10 sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] font-bold text-black">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold">
                {firstName}
              </p>

              <div className="flex items-center gap-1 text-xs text-zinc-400">
                <ShieldCheck className="h-3 w-3" />
                Administrator
              </div>
            </div>

            <ChevronDown className="hidden h-4 w-4 text-zinc-400 sm:block" />
          </div>
        </div>
      </div>
    </header>
  );
}