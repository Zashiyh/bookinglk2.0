"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Menu,
  Search,
  User,
  X,
  Compass,
  Map,
  Tag,
  ChevronDown,
  UserCircle,
  LogOut,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

type UserData = {
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  role?: string;
};

const navItems = [
  {
    label: "Explore",
    href: "/explore",
    icon: Compass,
  },
  {
    label: "Hotels",
    href: "/hotels",
    icon: Map,
  },
  {
    label: "Destinations",
    href: "/destinations",
    icon: Map,
  },
  {
    label: "Deals",
    href: "/deals",
    icon: Tag,
  },
];

/* =========================================================
   DISPLAY NAME
========================================================= */

function getDisplayName(user: UserData | null) {
  if (!user) return "";

  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }

  if (firstName) {
    return firstName;
  }

  if (lastName) {
    return lastName;
  }

  if (user.name?.trim()) {
    return user.name.trim();
  }

  if (user.email?.includes("@")) {
    return user.email.split("@")[0];
  }

  return "User";
}

/* =========================================================
   INITIALS
========================================================= */

function getInitials(user: UserData | null) {
  if (!user) return "U";

  const firstName = user.firstName?.trim() || "";
  const lastName = user.lastName?.trim() || "";

  if (firstName && lastName) {
    return (
      firstName.charAt(0) + lastName.charAt(0)
    ).toUpperCase();
  }

  if (firstName) {
    return firstName.charAt(0).toUpperCase();
  }

  if (lastName) {
    return lastName.charAt(0).toUpperCase();
  }

  if (user.name?.trim()) {
    const parts = user.name.trim().split(/\s+/);

    if (parts.length >= 2) {
      return (
        parts[0].charAt(0) +
        parts[parts.length - 1].charAt(0)
      ).toUpperCase();
    }

    return parts[0].charAt(0).toUpperCase();
  }

  if (user.email?.trim()) {
    return user.email.charAt(0).toUpperCase();
  }

  return "U";
}

/* =========================================================
   GREETING
========================================================= */

function getGreeting() {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  }

  if (hour >= 17 && hour < 22) {
    return "Good evening";
  }

  return "Good night";
}

/* =========================================================
   NAVBAR
========================================================= */

export function Navbar() {
  const [mobileOpen, setMobileOpen] =
    useState(false);

  const [user, setUser] =
    useState<UserData | null>(null);

  const [loadingUser, setLoadingUser] =
    useState(true);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const profileRef =
    useRef<HTMLDivElement>(null);

  /* =======================================================
     LOAD LOGGED-IN USER
  ======================================================= */

  useEffect(() => {
    async function loadUser() {
      try {
        const response = await fetch(
          "/api/auth/me",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        if (!response.ok) {
          setUser(null);
          return;
        }

        const result = await response.json();

        if (
          result.success &&
          result.user
        ) {
          setUser(result.user);
        } else if (
          result.success &&
          result.data
        ) {
          setUser(result.data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error(
          "NAVBAR_USER_ERROR:",
          error
        );

        setUser(null);
      } finally {
        setLoadingUser(false);
      }
    }

    loadUser();
  }, []);

  /* =======================================================
     CLOSE PROFILE DROPDOWN WHEN CLICKING OUTSIDE
  ======================================================= */

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
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

  /* =======================================================
     CLOSE MOBILE MENU ON ESC
  ======================================================= */

  useEffect(() => {
    function handleEscape(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        setProfileOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  /* =======================================================
     LOGOUT
  ======================================================= */

  async function handleLogout() {
    try {
      await fetch(
        "/api/auth/logout",
        {
          method: "POST",
        }
      );
    } catch (error) {
      console.error(
        "LOGOUT_ERROR:",
        error
      );
    } finally {
      setUser(null);
      setProfileOpen(false);
      setMobileOpen(false);

      window.location.href = "/";
    }
  }

  const displayName =
    getDisplayName(user);

  const initials =
    getInitials(user);

  const greeting =
    getGreeting();

  return (
    <>
      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ===================================================== */}

      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto px-4 pt-4 sm:px-6 lg:px-8">
          <nav
            className="
              mx-auto
              flex
              h-16
              max-w-7xl
              items-center
              justify-between
              rounded-2xl
              border
              border-[var(--border)]
              bg-white/80
              px-4
              shadow-lg
              shadow-black/5
              backdrop-blur-xl
              dark:bg-[#090909]/80
              sm:px-5
            "
          >
            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="/"
              className="group flex items-center gap-2"
              onClick={() => {
                setMobileOpen(false);
                setProfileOpen(false);
              }}
            >
              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  bg-[var(--gold)]
                  text-sm
                  font-black
                  text-black
                  shadow-sm
                  transition
                  group-hover:scale-105
                "
              >
                B
              </div>

              <div className="hidden sm:block">
                <div
                  className="
                    font-[var(--font-manrope)]
                    text-lg
                    font-extrabold
                    tracking-tight
                  "
                >
                  Booking
                  <span className="text-[var(--gold-bright)]">
                    LK
                  </span>
                </div>
              </div>
            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================= */}

            <div className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="
                      group
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      px-4
                      py-2
                      text-sm
                      text-[var(--muted)]
                      transition
                      hover:bg-black/5
                      hover:text-[var(--foreground)]
                      dark:hover:bg-white/5
                    "
                  >
                    <Icon
                      size={16}
                      className="
                        transition
                        group-hover:text-[var(--gold-bright)]
                      "
                    />

                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* =================================================
                DESKTOP RIGHT SIDE
            ================================================= */}

            <div className="hidden items-center gap-2 md:flex">
              {/* Search */}

              <button
                type="button"
                aria-label="Search"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-[var(--muted)]
                  transition
                  hover:bg-black/5
                  hover:text-[var(--gold-bright)]
                  dark:hover:bg-white/5
                "
              >
                <Search size={18} />
              </button>

              {/* Favorites */}

              <Link
                href="/favorites"
                aria-label="Favorites"
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  text-[var(--muted)]
                  transition
                  hover:bg-black/5
                  hover:text-[var(--gold-bright)]
                  dark:hover:bg-white/5
                "
              >
                <Heart size={18} />
              </Link>

              {/* =================================================
                  FIXED MY BOOKINGS / TRIPS LINK
              ================================================= */}

              <Link
                href="/my-bookings"
                className="
                  hidden
                  rounded-xl
                  px-4
                  py-2
                  text-sm
                  font-medium
                  text-[var(--muted)]
                  transition
                  hover:text-[var(--foreground)]
                  xl:block
                "
              >
                Trips
              </Link>

              {/* Theme */}

              <ThemeToggle />

              {/* =================================================
                  LOGGED USER
              ================================================= */}

              {!loadingUser && user ? (
                <div
                  ref={profileRef}
                  className="relative"
                >
                  {/* Profile button */}

                  <button
                    type="button"
                    onClick={() =>
                      setProfileOpen(
                        (value) => !value
                      )
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-[var(--border)]
                      bg-white/60
                      px-2.5
                      py-1.5
                      transition
                      hover:border-[var(--gold)]
                      hover:bg-white
                      dark:bg-white/5
                      dark:hover:bg-white/10
                    "
                  >
                    {/* Avatar */}

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--gold)]
                        text-xs
                        font-black
                        text-black
                      "
                    >
                      {initials}
                    </div>

                    {/* Name */}

                    <div className="hidden text-left xl:block">
                      <p
                        className="
                          text-[10px]
                          font-medium
                          text-[var(--muted)]
                        "
                      >
                        {greeting}
                      </p>

                      <p
                        className="
                          max-w-[130px]
                          truncate
                          text-sm
                          font-bold
                        "
                      >
                        {displayName}
                      </p>
                    </div>

                    <ChevronDown
                      size={15}
                      className={`
                        text-[var(--muted)]
                        transition
                        ${
                          profileOpen
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </button>

                  {/* =================================================
                      PROFILE DROPDOWN
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
                        className="
                          absolute
                          right-0
                          mt-3
                          w-64
                          origin-top-right
                          overflow-hidden
                          rounded-2xl
                          border
                          border-[var(--border)]
                          bg-white
                          shadow-2xl
                          shadow-black/10
                          dark:bg-[#111111]
                        "
                      >
                        {/* User header */}

                        <div
                          className="
                            border-b
                            border-[var(--border)]
                            p-4
                          "
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-[var(--gold)]
                                text-sm
                                font-black
                                text-black
                              "
                            >
                              {initials}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-bold">
                                {displayName}
                              </p>

                              <p
                                className="
                                  truncate
                                  text-xs
                                  text-[var(--muted)]
                                "
                              >
                                {user.email || ""}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 flex items-center justify-between">
                            <span
                              className="
                                text-xs
                                text-[var(--muted)]
                              "
                            >
                              {greeting}
                            </span>

                            <span
                              className="
                                rounded-full
                                bg-[var(--gold)]/10
                                px-2
                                py-1
                                text-[10px]
                                font-bold
                                uppercase
                                text-[var(--gold)]
                              "
                            >
                              {user.role || "USER"}
                            </span>
                          </div>
                        </div>

                        {/* Menu */}

                        <div className="p-2">
                          {/* Profile */}

                          <Link
                            href="/profile"
                            onClick={() =>
                              setProfileOpen(false)
                            }
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-3
                              text-sm
                              font-medium
                              transition
                              hover:bg-black/5
                              dark:hover:bg-white/5
                            "
                          >
                            <UserCircle
                              size={18}
                              className="text-[var(--gold)]"
                            />

                            <span>
                              View profile
                            </span>
                          </Link>

                          {/* =================================================
                              FIXED MY BOOKINGS
                          ================================================= */}

                          <Link
                            href="/my-bookings"
                            onClick={() =>
                              setProfileOpen(false)
                            }
                            className="
                              flex
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-3
                              text-sm
                              font-medium
                              transition
                              hover:bg-black/5
                              dark:hover:bg-white/5
                            "
                          >
                            <Compass
                              size={18}
                              className="text-[var(--gold)]"
                            />

                            <span>
                              My bookings
                            </span>
                          </Link>

                          <div className="my-1 h-px bg-[var(--border)]" />

                          {/* Logout */}

                          <button
                            type="button"
                            onClick={handleLogout}
                            className="
                              flex
                              w-full
                              items-center
                              gap-3
                              rounded-xl
                              px-3
                              py-3
                              text-sm
                              font-medium
                              text-red-500
                              transition
                              hover:bg-red-500/5
                            "
                          >
                            <LogOut size={18} />

                            <span>
                              Logout
                            </span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  {/* Sign In */}

                  <Link
                    href="/login"
                    className="
                      flex
                      items-center
                      gap-2
                      rounded-xl
                      border
                      border-[var(--border)]
                      px-4
                      py-2
                      text-sm
                      font-semibold
                      transition
                      hover:border-[var(--gold)]
                      hover:text-[var(--gold-bright)]
                    "
                  >
                    <User size={16} />

                    Sign In
                  </Link>

                  {/* Register */}

                  <Link
                    href="/register"
                    className="
                      rounded-xl
                      bg-[var(--gold)]
                      px-4
                      py-2
                      text-sm
                      font-bold
                      text-black
                      transition
                      hover:scale-[1.02]
                      hover:bg-[var(--gold-bright)]
                    "
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* =================================================
                MOBILE CONTROLS
            ================================================= */}

            <div className="flex items-center gap-1 md:hidden">
              {!loadingUser && user && (
                <div
                  className="
                    mr-1
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-xl
                    bg-[var(--gold)]
                    text-xs
                    font-black
                    text-black
                  "
                >
                  {initials}
                </div>
              )}

              <ThemeToggle />

              <button
                type="button"
                aria-label={
                  mobileOpen
                    ? "Close menu"
                    : "Open menu"
                }
                onClick={() =>
                  setMobileOpen(
                    (value) => !value
                  )
                }
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  transition
                  hover:bg-black/5
                  dark:hover:bg-white/5
                "
              >
                {mobileOpen ? (
                  <X size={21} />
                ) : (
                  <Menu size={21} />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -10,
            }}
            transition={{
              duration: 0.2,
            }}
            className="
              fixed
              inset-x-4
              top-24
              z-40
              md:hidden
            "
          >
            {/* SOLID MOBILE MENU */}

            <div
              className="
                rounded-2xl
                border
                border-[var(--border)]
                bg-white
                p-4
                shadow-2xl
                dark:bg-[#111111]
              "
            >
              {/* =================================================
                  LOGGED USER
              ================================================= */}

              {user && (
                <div
                  className="
                    mb-4
                    rounded-2xl
                    border
                    border-[var(--border)]
                    bg-zinc-100
                    p-4
                    dark:bg-white/5
                  "
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        rounded-xl
                        bg-[var(--gold)]
                        text-sm
                        font-black
                        text-black
                      "
                    >
                      {initials}
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          text-xs
                          text-[var(--muted)]
                        "
                      >
                        {greeting}
                      </p>

                      <p className="truncate text-sm font-bold">
                        {displayName}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* =================================================
                  NAVIGATION LINKS
              ================================================= */}

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() =>
                        setMobileOpen(false)
                      }
                      className="
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        px-4
                        py-3
                        text-sm
                        font-medium
                        text-[var(--muted)]
                        transition
                        hover:bg-zinc-100
                        hover:text-[var(--foreground)]
                        dark:hover:bg-white/5
                      "
                    >
                      <Icon size={18} />

                      {item.label}
                    </Link>
                  );
                })}
              </div>

              {/* Divider */}

              <div className="my-4 h-px bg-[var(--border)]" />

              {/* =================================================
                  LOGGED USER ACTIONS
              ================================================= */}

              {user ? (
                <div className="space-y-1">
                  {/* Profile */}

                  <Link
                    href="/profile"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      transition
                      hover:bg-zinc-100
                      dark:hover:bg-white/5
                    "
                  >
                    <UserCircle size={18} />

                    View profile
                  </Link>

                  {/* =================================================
                      FIXED MOBILE MY BOOKINGS
                  ================================================= */}

                  <Link
                    href="/my-bookings"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      transition
                      hover:bg-zinc-100
                      dark:hover:bg-white/5
                    "
                  >
                    <Compass size={18} />

                    My bookings
                  </Link>

                  {/* Logout */}

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      flex
                      w-full
                      items-center
                      gap-3
                      rounded-xl
                      px-4
                      py-3
                      text-sm
                      font-semibold
                      text-red-500
                      transition
                      hover:bg-red-500/5
                    "
                  >
                    <LogOut size={18} />

                    Logout
                  </button>
                </div>
              ) : (
                /* =================================================
                   GUEST ACTIONS
                ================================================= */

                <div className="grid grid-cols-2 gap-2">
                  {/* Sign In */}

                  <Link
                    href="/login"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="
                      rounded-xl
                      border
                      border-[var(--border)]
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-semibold
                      transition
                      hover:border-[var(--gold)]
                      hover:text-[var(--gold-bright)]
                    "
                  >
                    Sign In
                  </Link>

                  {/* Register */}

                  <Link
                    href="/register"
                    onClick={() =>
                      setMobileOpen(false)
                    }
                    className="
                      rounded-xl
                      bg-[var(--gold)]
                      px-4
                      py-3
                      text-center
                      text-sm
                      font-bold
                      text-black
                      transition
                      hover:bg-[var(--gold-bright)]
                    "
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}