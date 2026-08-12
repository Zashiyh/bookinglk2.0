"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  ShieldCheck,
  UserCircle,
  LogOut,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
}

export default function AdminNavbar() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  /* =========================================================
     LOAD ADMIN USER
  ========================================================= */

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch("/api/admin/me", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const text = await response.text();

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
        console.error("ADMIN_USER_ERROR:", error);
      }
    }

    loadUser();
  }, []);

  /* =========================================================
     CLOSE DROPDOWN WHEN CLICKING OUTSIDE
  ========================================================= */

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(
          event.target as Node
        )
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  /* =========================================================
     LOGOUT
  ========================================================= */

  async function handleLogout() {
    if (loggingOut) return;

    try {
      setLoggingOut(true);

      const response = await fetch(
        "/api/admin/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        console.error(
          "ADMIN_LOGOUT_FAILED:",
          response.status
        );
      }
    } catch (error) {
      console.error(
        "ADMIN_LOGOUT_ERROR:",
        error
      );
    } finally {
      setUser(null);
      setProfileOpen(false);

      window.location.href = "/admin/login";
    }
  }

  /* =========================================================
     USER DATA
  ========================================================= */

  const firstName =
    user?.firstName || "Admin";

  const fullName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Administrator";

  const initials =
    `${user?.firstName?.charAt(0) ?? "A"}${
      user?.lastName?.charAt(0) ?? ""
    }`.toUpperCase();

  const role =
    user?.role === "SUPER_ADMIN"
      ? "Super Administrator"
      : "Administrator";

  /* =========================================================
     UI
  ========================================================= */

  return (
    <header className="sticky top-0 z-40 h-20 border-b border-zinc-200 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#080808]/80">
      <div className="flex h-full items-center justify-between px-6">

        {/* =================================================
            LEFT
        ================================================= */}

        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            Administration
          </p>

          <h1 className="mt-1 text-lg font-bold text-zinc-900 dark:text-white">
            BookingLK Control Center
          </h1>
        </div>

        {/* =================================================
            RIGHT
        ================================================= */}

        <div className="flex items-center gap-3">

          {/* Notification */}

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-zinc-200 transition hover:bg-zinc-100 dark:border-white/10 dark:hover:bg-white/5"
          >
            <Bell className="h-4 w-4" />

            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#D4AF37]" />
          </button>

          <div className="hidden h-8 w-px bg-zinc-200 dark:bg-white/10 sm:block" />

          {/* =================================================
              PROFILE
          ================================================= */}

          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setProfileOpen(
                  (value) => !value
                )
              }
              className="flex items-center gap-3 rounded-2xl border border-transparent px-2 py-1.5 transition hover:border-zinc-200 hover:bg-zinc-100 dark:hover:border-white/10 dark:hover:bg-white/5"
            >

              {/* Avatar */}

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37] font-bold text-black shadow-sm">
                {initials}
              </div>

              {/* Name */}

              <div className="hidden text-left sm:block">
                <p className="max-w-[140px] truncate text-sm font-semibold text-zinc-900 dark:text-white">
                  {firstName}
                </p>

                <div className="flex items-center gap-1 text-xs text-zinc-400">
                  <ShieldCheck className="h-3 w-3" />

                  {role}
                </div>
              </div>

              {/* Chevron */}

              <ChevronDown
                className={`hidden h-4 w-4 text-zinc-400 transition-transform sm:block ${
                  profileOpen
                    ? "rotate-180"
                    : ""
                }`}
              />
            </button>

            {/* =================================================
                DROPDOWN
            ================================================= */}

            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{
                    opacity: 0,
                    y: -8,
                    scale: 0.97,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    y: -8,
                    scale: 0.97,
                  }}
                  transition={{
                    duration: 0.15,
                  }}
                  className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl shadow-black/10 dark:border-white/10 dark:bg-[#111111]"
                >

                  {/* User information */}

                  <div className="border-b border-zinc-200 p-4 dark:border-white/10">
                    <div className="flex items-center gap-3">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-black text-black">
                        {initials}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
                          {fullName}
                        </p>

                        <p className="truncate text-xs text-zinc-400">
                          {user?.email || ""}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between">

                      <div className="flex items-center gap-1.5 text-xs text-zinc-400">
                        <ShieldCheck className="h-3.5 w-3.5 text-[#D4AF37]" />

                        {role}
                      </div>

                      <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#B8860B] dark:text-[#F5D76E]">
                        {user?.role || "ADMIN"}
                      </span>
                    </div>
                  </div>

                  {/* Menu */}

                  <div className="p-2">

                    {/* Profile */}

                    <Link
                      href="/admin/profile"
                      onClick={() =>
                        setProfileOpen(false)
                      }
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5"
                    >
                      <UserCircle className="h-5 w-5 text-[#D4AF37]" />

                      <div>
                        <p className="font-semibold">
                          My Profile
                        </p>

                        <p className="text-xs text-zinc-400">
                          View administrator profile
                        </p>
                      </div>
                    </Link>

                    {/* Divider */}

                    <div className="my-1 h-px bg-zinc-200 dark:bg-white/10" />

                    {/* Logout */}

                    <button
                      type="button"
                      disabled={loggingOut}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-red-500 transition hover:bg-red-500/5 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <LogOut className="h-5 w-5" />

                      <div>
                        <p className="font-semibold">
                          {loggingOut
                            ? "Logging out..."
                            : "Logout"}
                        </p>

                        <p className="text-xs text-red-400/70">
                          Sign out of admin panel
                        </p>
                      </div>
                    </button>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
}