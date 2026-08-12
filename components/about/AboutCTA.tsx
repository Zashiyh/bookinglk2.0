"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutCTA() {
  return (
    <section className="px-4 pb-20 sm:px-6 lg:px-8">
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
              <MapPin className="h-5 w-5 text-[#D4AF37]" />

              <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#B8860B] dark:text-[#F5D76E]">
                Your next journey
              </span>
            </div>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Ready to explore
              <br className="hidden sm:block" />
              Sri Lanka?
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Find your next stay and start planning an
              unforgettable journey across the island.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/hotels"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#F5D76E]"
            >
              Find a hotel
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/deals"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold transition hover:border-[#D4AF37]/40 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <Sparkles className="h-4 w-4 text-[#D4AF37]" />
              See deals
            </Link>
          </div>

        </div>
      </motion.div>
    </section>
  );
}