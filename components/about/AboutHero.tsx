"use client";

import { motion } from "framer-motion";
import { ArrowRight, Compass, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AboutHero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white pt-28 dark:border-white/[0.07] dark:bg-[#080808]">
      {/* Background glow */}
      <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[150px]" />

      <div className="pointer-events-none absolute left-[-120px] top-40 h-[300px] w-[300px] rounded-full bg-purple-500/[0.05] blur-[120px]" />

      <div className="pointer-events-none absolute right-[-100px] top-20 h-[350px] w-[350px] rounded-full bg-blue-500/[0.04] blur-[130px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]"
          >
            <Sparkles className="h-4 w-4" />
            About BookingLK
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl"
          >
            Discover Sri Lanka.

            <br />

            <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D76E] bg-clip-text text-transparent">
              Stay your way.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-7 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base"
          >
            BookingLK is built to make discovering and booking
            hotels across Sri Lanka simpler, smarter and more
            enjoyable.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              href="/hotels"
              className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-6 py-3.5 text-sm font-bold text-black transition hover:scale-[1.02] hover:bg-[#F5D76E]"
            >
              Explore hotels
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href="/deals"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-6 py-3.5 text-sm font-semibold transition hover:border-[#D4AF37]/40 dark:border-white/10 dark:bg-white/[0.04]"
            >
              <Compass className="h-4 w-4" />
              Explore deals
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}