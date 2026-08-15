"use client";

import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  CalendarClock,
  CheckCircle2,
  Clock3,
  HelpCircle,
  Info,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import Link from "next/link";

const policies = [
  {
    title: "Free cancellation",
    description:
      "Some properties allow you to cancel your reservation without a cancellation fee before the deadline specified in your booking.",
    icon: CheckCircle2,
  },
  {
    title: "Partial refund",
    description:
      "Certain reservations may provide a partial refund when cancelled within the property's permitted cancellation period.",
    icon: Clock3,
  },
  {
    title: "Non-refundable",
    description:
      "Some room rates are non-refundable. These bookings may not qualify for a refund after confirmation.",
    icon: XCircle,
  },
];

export default function CancellationPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[10%] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/7 blur-[130px]" />

        <div className="absolute right-[-10%] top-[45%] h-[500px] w-[500px] rounded-full bg-red-500/5 blur-[150px]" />
      </div>

      {/* Navigation */}
      <section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
        <Link
          href="/help"
          className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-x-0.5 hover:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Help Center
        </Link>
      </section>

      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#D4AF37]/10">
          <CalendarClock className="h-8 w-8 text-[#D4AF37]" />
        </div>

        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-xs font-semibold text-[#B8860B] dark:text-[#F5D76E]">
          <ShieldCheck className="h-3.5 w-3.5" />
          BookingLK Policy
        </div>

        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Cancellation policy
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-500 dark:text-zinc-400 sm:text-lg">
          Understand how cancellations, refunds, deadlines and
          booking changes work on BookingLK.
        </p>
      </section>

      {/* Important notice */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 rounded-3xl border border-[#D4AF37]/25 bg-[#D4AF37]/5 p-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37]/15">
            <Info className="h-5 w-5 text-[#B8860B] dark:text-[#F5D76E]" />
          </div>

          <div>
            <h2 className="font-semibold">
              Your property's policy always applies
            </h2>

            <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
              Cancellation conditions can differ between hotels,
              room types and rates. The exact cancellation policy
              shown during checkout and in your booking confirmation
              is the policy that applies to your reservation.
            </p>
          </div>
        </div>
      </section>

      {/* Cancellation types */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            Before you cancel
          </p>

          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Cancellation options
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400">
            Check your reservation details carefully to understand
            what applies to your specific booking.
          </p>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {policies.map((policy) => {
            const Icon = policy.icon;

            return (
              <article
                key={policy.title}
                className="rounded-[2rem] border border-zinc-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#111111]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                  <Icon className="h-6 w-6 text-[#B8860B] dark:text-[#F5D76E]" />
                </div>

                <h3 className="mt-6 text-xl font-semibold">
                  {policy.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                  {policy.description}
                </p>
              </article>
            );
          })}
        </div>
      </section>

      {/* How cancellation works */}
      <section className="border-y border-zinc-200 bg-white dark:border-white/10 dark:bg-[#0b0b0b]">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="h-8 w-1 rounded-full bg-[#D4AF37]" />

            <h2 className="text-2xl font-semibold">
              How to cancel a booking
            </h2>
          </div>

          <div className="mt-10 space-y-5">
            {[
              {
                number: "01",
                title: "Open your booking",
                text: "Sign in to BookingLK and open the reservation you want to cancel.",
              },
              {
                number: "02",
                title: "Check the cancellation policy",
                text: "Review the cancellation deadline, applicable fees and refund information shown for your reservation.",
              },
              {
                number: "03",
                title: "Select cancellation",
                text: "Choose the cancellation option available for your booking and review the details before confirming.",
              },
              {
                number: "04",
                title: "Receive confirmation",
                text: "After cancellation is completed, BookingLK will display the updated reservation status and applicable refund information.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="flex gap-5 rounded-3xl border border-zinc-200 bg-[#fafafa] p-5 dark:border-white/10 dark:bg-[#111111] sm:p-6"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#D4AF37] text-sm font-bold text-black">
                  {step.number}
                </div>

                <div>
                  <h3 className="font-semibold">
                    {step.title}
                  </h3>

                  <p className="mt-2 text-sm leading-7 text-zinc-500 dark:text-zinc-400">
                    {step.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Important conditions */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[2rem] border border-red-200 bg-red-50 p-7 dark:border-red-500/20 dark:bg-red-500/5 sm:p-9">
          <div className="flex gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold">
                Important to know
              </h2>

              <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-600 dark:text-zinc-400">
                <p>
                  • Cancelling after the property's stated
                  deadline may result in a cancellation fee.
                </p>

                <p>
                  • Non-refundable bookings may not qualify for a
                  refund.
                </p>

                <p>
                  • Refund processing times can depend on the
                  payment method and financial institution.
                </p>

                <p>
                  • If a hotel changes or cancels your reservation,
                  different options may apply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#111111] p-8 text-white shadow-2xl sm:p-12">
          <div className="absolute right-[-80px] top-[-100px] h-64 w-64 rounded-full bg-[#D4AF37]/15 blur-[80px]" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/15">
              <HelpCircle className="h-6 w-6 text-[#F5D76E]" />
            </div>

            <h2 className="mt-6 text-3xl font-semibold">
              Need help with a cancellation?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-7 text-zinc-400">
              Visit our Help Center for answers to common booking
              questions or contact BookingLK support if you need
              further assistance.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/help"
                className="inline-flex items-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
              >
                Visit Help Center
                <ArrowUpRight className="h-4 w-4" />
              </Link>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Contact support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}