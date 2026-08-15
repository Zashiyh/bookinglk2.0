"use client";

import {
  ArrowLeft,
  ChevronRight,
  KeyRound,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Link from "next/link";

import { Navbar } from "@/components/navbar/navbar";

export default function ProfileSettingsPage() {
  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      <div className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6">
        {/* Back */}
        <Link
          href="/profile"
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Profile Settings
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-white/40 sm:text-base">
            Manage your personal information, password,
            email address and account security.
          </p>
        </div>

        {/* Settings */}
        <div className="mt-8 space-y-4">
          {/* Personal Information */}
          <Link
            href="/profile"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:border-[#D4AF37]/25 hover:bg-white/[0.055]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
              <UserRound className="h-5 w-5 text-[#D4AF37]" />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="font-medium">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-white/35">
                Manage your name, phone number and profile
                information.
              </p>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60" />
          </Link>

          {/* Change Password */}
          <Link
            href="/profile/settings/password"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:border-[#D4AF37]/25 hover:bg-white/[0.055]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <KeyRound className="h-5 w-5 text-white/70" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-medium">
                  Change Password
                </h2>

                <span className="rounded-full border border-emerald-400/15 bg-emerald-400/[0.07] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-300">
                  OTP Protected
                </span>
              </div>

              <p className="mt-1 text-sm text-white/35">
                Verify your identity through email before
                changing your password.
              </p>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60" />
          </Link>

          {/* Change Email */}
          <Link
            href="/profile/settings/email"
            className="group flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-xl transition duration-300 hover:border-[#D4AF37]/25 hover:bg-white/[0.055]"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/[0.06]">
              <Mail className="h-5 w-5 text-white/70" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-medium">
                  Change Email Address
                </h2>

                <span className="rounded-full border border-[#D4AF37]/15 bg-[#D4AF37]/[0.06] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-[#D4AF37]">
                  Email Verification
                </span>
              </div>

              <p className="mt-1 text-sm text-white/35">
                Add a new email and verify it with a
                confirmation code.
              </p>
            </div>

            <ChevronRight className="h-5 w-5 shrink-0 text-white/25 transition group-hover:translate-x-1 group-hover:text-white/60" />
          </Link>

          {/* Security */}
          <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.035] p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>

              <div>
                <h2 className="font-medium">
                  Account Security
                </h2>

                <p className="mt-1 text-sm leading-6 text-white/35">
                  Sensitive account changes require
                  verification through your registered email
                  address.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-xs text-white/45">
                    Secure authentication
                  </span>

                  <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-xs text-white/45">
                    Email OTP
                  </span>

                  <span className="rounded-full border border-white/[0.07] bg-white/[0.03] px-3 py-1 text-xs text-white/45">
                    Protected changes
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Security note */}
        <div className="mt-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5">
          <p className="text-xs leading-5 text-white/30">
            For your security, BookingLK will never change
            your password or email address without completing
            the required verification process.
          </p>
        </div>
      </div>
    </main>
  );
}