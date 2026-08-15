"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Cookie,
  Settings2,
  ShieldCheck,
} from "lucide-react";

const cookieTypes = [
  {
    title: "Essential Cookies",
    description:
      "These cookies help BookingLK operate correctly. They may support login sessions, security features, booking functionality, and basic website operations.",
    required: true,
  },
  {
    title: "Functional Cookies",
    description:
      "These cookies help remember preferences and settings so that your experience can be more convenient when you return to BookingLK.",
    required: false,
  },
  {
    title: "Analytics Cookies",
    description:
      "Analytics technologies may help us understand how visitors use BookingLK, which pages are useful, and where improvements can be made.",
    required: false,
  },
  {
    title: "Preference Cookies",
    description:
      "These technologies may remember choices such as interface preferences or certain settings to provide a more personalized experience.",
    required: false,
  },
];

const sections = [
  {
    title: "What Are Cookies?",
    content:
      "Cookies are small data files stored on your device by websites. They allow websites to remember information about your visit and can help provide a smoother and more secure experience.",
  },
  {
    title: "Why We Use Cookies",
    content:
      "BookingLK may use cookies and similar technologies to keep users signed in, maintain security, remember preferences, understand website usage, and improve the platform.",
  },
  {
    title: "Managing Cookies",
    content:
      "Most modern browsers allow you to manage or delete cookies through their settings. Disabling certain cookies may affect some BookingLK features or functionality.",
  },
  {
    title: "Third-Party Services",
    content:
      "Some services integrated into BookingLK may use their own cookies or similar technologies. Their use of information is governed by the relevant provider's policies.",
  },
];

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm dark:border-white/10 dark:bg-[#111111]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to BookingLK
        </Link>

        <div className="mt-12 rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-10 lg:p-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
            <Cookie className="h-7 w-7 text-[#D4AF37]" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            BookingLK
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Cookie Policy
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
            This Cookie Policy explains how BookingLK uses cookies and similar
            technologies to operate, secure, and improve our website.
          </p>

          <div className="mt-8 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
            <ShieldCheck className="h-4 w-4 text-[#D4AF37]" />
            Last updated: August 15, 2026
          </div>

          <div className="mt-12 space-y-10">
            {sections.map((section, index) => (
              <section key={section.title}>
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#D4AF37]/10 text-xs font-bold text-[#B8860B] dark:text-[#F5D76E]">
                    {index + 1}
                  </span>

                  <div>
                    <h2 className="text-xl font-semibold">
                      {section.title}
                    </h2>

                    <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                      {section.content}
                    </p>
                  </div>
                </div>
              </section>
            ))}
          </div>

          <section className="mt-12">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                <Settings2 className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <div>
                <h2 className="text-xl font-semibold">
                  Types of cookies
                </h2>

                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Different cookies serve different purposes.
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {cookieTypes.map((cookie) => (
                <div
                  key={cookie.title}
                  className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h3 className="font-semibold">
                      {cookie.title}
                    </h3>

                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                        cookie.required
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                          : "bg-zinc-200 text-zinc-600 dark:bg-white/10 dark:text-zinc-400"
                      }`}
                    >
                      {cookie.required ? "Required" : "Optional"}
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {cookie.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="mt-12 rounded-3xl bg-zinc-50 p-6 dark:bg-white/5">
            <h2 className="font-semibold">
              Want to learn more?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              For more information about how BookingLK handles personal
              information, please read our Privacy Policy.
            </p>

            <Link
              href="/privacy"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              Read Privacy Policy
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}