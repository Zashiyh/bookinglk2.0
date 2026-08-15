"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  CreditCard,
  Eye,
  FileWarning,
  LockKeyhole,
  MapPin,
  MessageSquareWarning,
  PhoneCall,
  ShieldCheck,
  UserCheck,
} from "lucide-react";
import Link from "next/link";

const safetyTips = [
  {
    icon: UserCheck,
    title: "Verify property information",
    description:
      "Review the hotel's profile, location, amenities, photos and guest reviews before booking.",
  },
  {
    icon: BadgeCheck,
    title: "Look for verified properties",
    description:
      "BookingLK Verified properties have completed the platform's verification process.",
  },
  {
    icon: CreditCard,
    title: "Keep payments secure",
    description:
      "Only use official BookingLK payment and checkout flows. Never share sensitive payment information with unknown people.",
  },
  {
    icon: MessageSquareWarning,
    title: "Be careful with messages",
    description:
      "Do not share passwords, verification codes or sensitive personal information through unexpected messages.",
  },
  {
    icon: MapPin,
    title: "Check the location",
    description:
      "Review the property's address and surrounding area before travelling.",
  },
  {
    icon: Eye,
    title: "Trust your judgement",
    description:
      "If something feels suspicious or different from the original booking details, contact support before continuing.",
  },
];

export default function SafetyPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-15%] top-[5%] h-[450px] w-[450px] rounded-full bg-[#D4AF37]/10 blur-[140px]" />
        <div className="absolute right-[-10%] top-[30%] h-[500px] w-[500px] rounded-full bg-emerald-500/5 blur-[150px]" />
      </div>

      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-x-0.5 hover:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back home
        </Link>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-16 pt-16 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10">
          <ShieldCheck className="h-8 w-8 text-emerald-500" />
        </div>

        <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
          Travel safely
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-6xl">
          Your safety matters
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400">
          Simple safety guidelines to help you make confident
          decisions while using BookingLK.
        </p>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-emerald-200 bg-emerald-50 p-7 dark:border-emerald-500/20 dark:bg-emerald-500/5 sm:p-9">
          <div className="flex items-start gap-4">
            <LockKeyhole className="mt-1 h-6 w-6 shrink-0 text-emerald-500" />

            <div>
              <h2 className="text-xl font-semibold">
                Stay secure on BookingLK
              </h2>

              <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                BookingLK is designed to make hotel discovery and
                reservations easier. Always use the official
                BookingLK website and account features when
                searching, booking and managing your reservations.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-[#D4AF37]" />
          <h2 className="text-2xl font-semibold">
            Safety guidelines
          </h2>
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {safetyTips.map((tip) => {
            const Icon = tip.icon;

            return (
              <article
                key={tip.title}
                className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#111111]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <Icon className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
                </div>

                <h3 className="mt-5 font-semibold">
                  {tip.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                  {tip.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-200 bg-white p-7 dark:border-white/10 dark:bg-[#111111]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertTriangle className="h-6 w-6 text-red-500" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Watch for suspicious activity
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              Be cautious if someone asks you to pay outside the
              official booking process, requests passwords or
              verification codes, or sends unexpected links.
            </p>
          </div>

          <div className="rounded-3xl border border-zinc-200 bg-white p-7 dark:border-white/10 dark:bg-[#111111]">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <FileWarning className="h-6 w-6 text-[#D4AF37]" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Report something unusual
            </h2>

            <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              If you notice suspicious property information,
              communication or booking activity, contact BookingLK
              support and provide the relevant booking details.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-10">
          <div className="flex flex-col gap-7 md:flex-row md:items-center">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <PhoneCall className="h-6 w-6 text-[#D4AF37]" />
            </div>

            <div className="flex-1">
              <h2 className="text-xl font-semibold">
                Need help with a safety concern?
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Contact BookingLK support if you encounter suspicious
                activity or need assistance with your reservation.
              </p>
            </div>

            <Link
              href="/help"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              Get help
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-zinc-200 bg-zinc-50 p-7 text-center dark:border-white/10 dark:bg-white/[0.03]">
          <ShieldCheck className="mx-auto h-7 w-7 text-[#D4AF37]" />

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            These guidelines are intended to help you travel more
            confidently. In an emergency or immediate danger,
            contact the appropriate local emergency services.
          </p>
        </div>
      </section>
    </main>
  );
}