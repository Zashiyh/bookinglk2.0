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
} from "lucide-react";
import { useState } from "react";

import { ThemeToggle } from "@/components/ui/theme-toggle";

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

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        <div className="container-booking pt-4">
          <nav className="glass flex h-16 items-center justify-between rounded-2xl px-4 sm:px-6">
            {/* Logo */}
            <Link
              href="/"
              className="group flex items-center gap-2"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gold)] text-black">
                <span className="font-black">B</span>
              </div>

              <div className="hidden sm:block">
                <div className="font-[var(--font-manrope)] text-lg font-extrabold tracking-tight">
                  Booking<span className="text-[var(--gold-bright)]">LK</span>
                </div>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden items-center gap-1 lg:flex">
              {navItems.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="group flex items-center gap-2 rounded-xl px-4 py-2 text-sm text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/5"
                  >
                    <Icon
                      size={16}
                      className="transition group-hover:text-[var(--gold-bright)]"
                    />

                    {item.label}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                aria-label="Search"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--gold-bright)] dark:hover:bg-white/5"
              >
                <Search size={18} />
              </button>

              <Link
                href="/favorites"
                aria-label="Favorites"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--gold-bright)] dark:hover:bg-white/5"
              >
                <Heart size={18} />
              </Link>

              <Link
                href="/dashboard/bookings"
                className="hidden rounded-xl px-4 py-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)] xl:block"
              >
                Trips
              </Link>

              <ThemeToggle />

              <Link
                href="/login"
                className="flex items-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2 text-sm font-semibold transition hover:border-[var(--gold)] hover:text-[var(--gold-bright)]"
              >
                <User size={16} />
                Sign In
              </Link>

              <Link
                href="/register"
                className="rounded-xl bg-[var(--gold)] px-4 py-2 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[var(--gold-bright)]"
              >
                Get Started
              </Link>
            </div>

            {/* Mobile controls */}
            <div className="flex items-center gap-1 md:hidden">
              <ThemeToggle />

              <button
                aria-label="Open menu"
                onClick={() => setMobileOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-xl transition hover:bg-black/5 dark:hover:bg-white/5"
              >
                {mobileOpen ? <X size={21} /> : <Menu size={21} />}
              </button>
            </div>
          </nav>
        </div>
      </header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="fixed inset-x-4 top-24 z-40 md:hidden"
          >
            <div className="glass rounded-2xl p-4 shadow-2xl">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-[var(--muted)] transition hover:bg-black/5 hover:text-[var(--foreground)] dark:hover:bg-white/5"
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="my-4 h-px bg-[var(--border)]" />

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-3 text-center text-sm font-semibold"
                >
                  Sign In
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl bg-[var(--gold)] px-4 py-3 text-center text-sm font-bold text-black"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}