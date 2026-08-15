"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  FileText,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    title: "Using BookingLK",
    content:
      "BookingLK provides an online platform that allows users to discover properties, compare accommodation options, make reservations, manage bookings, and share reviews.",
  },
  {
    title: "Accounts",
    content:
      "You are responsible for keeping your account credentials secure and for providing accurate information when creating or using an account. You should notify us if you believe your account has been accessed without authorization.",
  },
  {
    title: "Reservations",
    content:
      "A reservation is subject to the availability, pricing, policies, and conditions displayed for the selected property. You are responsible for reviewing booking details before confirming a reservation.",
  },
  {
    title: "Prices and Payments",
    content:
      "Prices displayed on BookingLK may vary depending on dates, room type, availability, taxes, fees, promotions, and property policies. Payment requirements are presented during the booking process.",
  },
  {
    title: "Cancellation",
    content:
      "Cancellation and refund conditions depend on the policy associated with the specific booking or property. You should review the applicable cancellation terms before completing your reservation.",
  },
  {
    title: "Reviews",
    content:
      "Reviews should be honest, relevant, and based on genuine experiences. BookingLK may remove content that violates our policies, contains abusive material, or is otherwise inappropriate.",
  },
  {
    title: "Prohibited Activities",
    content:
      "You must not misuse BookingLK, attempt unauthorized access, interfere with platform security, submit fraudulent information, abuse promotions, or use the service for unlawful activities.",
  },
  {
    title: "Changes to the Service",
    content:
      "BookingLK may update, modify, suspend, or discontinue parts of the platform when necessary to improve the service, maintain security, or comply with applicable requirements.",
  },
  {
    title: "Limitation of Responsibility",
    content:
      "BookingLK acts as a platform connecting travelers and accommodation providers. Property-specific services and experiences are primarily the responsibility of the relevant accommodation provider.",
  },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-x-0.5 hover:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to BookingLK
        </Link>

        <div className="mt-12 rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm dark:border-white/10 dark:bg-[#111111] sm:p-10 lg:p-14">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
            <FileText className="h-7 w-7 text-[#D4AF37]" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            BookingLK
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Terms of Service
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
            These terms explain the rules and conditions that apply when you
            access or use the BookingLK platform and its hotel booking
            services.
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

          <div className="mt-12 rounded-3xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-6">
            <h2 className="font-semibold">
              Need help with a booking?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-600 dark:text-zinc-400">
              Our Help Center can guide you through reservations,
              cancellations, account questions, and other BookingLK services.
            </p>

            <Link
              href="/help"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              Open Help Center
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}