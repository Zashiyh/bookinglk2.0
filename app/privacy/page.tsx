"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

const sections = [
  {
    title: "Information We Collect",
    content:
      "When you use BookingLK, we may collect information such as your name, email address, phone number, booking details, account information, and information you provide when communicating with us.",
  },
  {
    title: "How We Use Your Information",
    content:
      "We use your information to provide and improve our hotel booking services, process reservations, communicate booking updates, provide customer support, prevent fraud, and maintain the security of our platform.",
  },
  {
    title: "Booking Information",
    content:
      "When you make a reservation, relevant booking information may be shared with the selected hotel or property so that your reservation can be processed and fulfilled.",
  },
  {
    title: "Payments",
    content:
      "Payment information is processed through appropriate payment providers. BookingLK does not intentionally store complete payment card details on its own servers.",
  },
  {
    title: "Account Information",
    content:
      "If you create a BookingLK account, we may store information associated with your account so that you can manage bookings, reviews, favorites, and other account features.",
  },
  {
    title: "Reviews and Public Content",
    content:
      "Reviews and other content you choose to publish on BookingLK may be visible to other users. Please avoid including sensitive personal information in publicly visible content.",
  },
  {
    title: "Data Security",
    content:
      "We use reasonable technical and organizational measures designed to protect your information against unauthorized access, misuse, alteration, or disclosure. However, no online service can guarantee complete security.",
  },
  {
    title: "Your Choices",
    content:
      "You may request access to, correction of, or deletion of certain personal information associated with your account, subject to applicable requirements and legitimate business needs.",
  },
];

export default function PrivacyPage() {
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
            <LockKeyhole className="h-7 w-7 text-[#D4AF37]" />
          </div>

          <p className="mt-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            BookingLK
          </p>

          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mt-5 max-w-3xl text-base leading-8 text-zinc-600 dark:text-zinc-400">
            Your privacy matters to us. This Privacy Policy explains how
            BookingLK collects, uses, protects, and handles information when
            you use our platform and services.
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

          <div className="mt-12 rounded-3xl bg-zinc-50 p-6 dark:bg-white/5">
            <h2 className="font-semibold">Questions about privacy?</h2>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              If you have questions about how your information is handled,
              please contact the BookingLK support team.
            </p>

            <Link
              href="/help"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              Visit Help Center
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}