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
  role: "ADMIN" | "SUPER_ADMIN";
}

export default function AdminNavbar() {
  const [user, setUser] =
    useState<AdminUser | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          "/api/admin/me",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const text =
          await response.text();

        let result: {
          success?: boolean;
          message?: string;
          data?: AdminUser;
        } = {};

        if (text.trim()) {
          try {
            result = JSON.parse(text);
          } catch {
            throw new Error(
              "Invalid response from administrator API."
            );
          }
        }

        if (
          !response.ok ||
          !result.success ||
          !result.data
        ) {
          throw new Error(
            result.message ||
              `Unable to load administrator (${response.status})`
          );
        }

        setUser(result.data);
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
    <header className="sticky top-0 z-40 h-20 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#080808]/80">
      <div className="flex h-full items-center justify-between px-6">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Administration
          </p>

          <h1 className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
            BookingLK Control Center
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
          >
            <Bell className="h-4 w-4" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          </button>

          <div className="hidden h-8 w-px bg-zinc-200 dark:bg-white/10 sm:block" />

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] font-bold text-black">
              {initials}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-zinc-900 dark:text-white">
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