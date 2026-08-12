"use client";

import { motion } from "framer-motion";
import { ArrowRight, Hotel, Sparkles } from "lucide-react";
import Link from "next/link";

export default function ContactCTA() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mx-auto max-w-7xl overflow-hidden rounded-[32px] border border-[#D4AF37]/20 bg-gradient-to-br from-[#D4AF37]/10 via-white to-zinc-50 p-8 dark:from-[#D4AF37]/10 dark:via-[#101010] dark:to-[#080808] sm:p-12 lg:p-16"
      >
        <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[350px] w-[350px] rounded-full bg-[#D4AF37]/10 blur-[110px]" />

        <div className="relative flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <div className="flex items-center justify-center gap-2 lg:justify-start">
              <Hotel className="h-5 w-5 text-[#D4AF37]" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8860B] dark:text-[#F5D76E]">
                Hotel partners
              </span>
            </div>

            <h2 className="mt-4 text-2xl font-black sm:text-3xl">
              Want to list your hotel?
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Join BookingLK and connect your property with
              travelers looking for their next stay in Sri Lanka.
            </p>
          </div>

          <Link
            href="/register"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#F5D76E]"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}