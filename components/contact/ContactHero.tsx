"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, Sparkles } from "lucide-react";

export default function ContactHero() {
  return (
    <section className="relative overflow-hidden border-b border-zinc-200 bg-white pt-28 dark:border-white/[0.07] dark:bg-[#080808]">
      <div className="pointer-events-none absolute left-1/2 top-[-220px] h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[150px]" />

      <div className="pointer-events-none absolute right-[-100px] top-24 h-[300px] w-[300px] rounded-full bg-purple-500/[0.04] blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/25 bg-[#D4AF37]/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]"
          >
            <Sparkles className="h-4 w-4" />
            Contact BookingLK
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl font-black tracking-[-0.05em] sm:text-6xl lg:text-7xl"
          >
            Let's talk.

            <br />

            <span className="bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#F5D76E] bg-clip-text text-transparent">
              We're here to help.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base"
          >
            Have a question about a booking, hotel, payment or
            anything else? Send us a message and our team will
            get back to you.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-3"
          >
            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
              <MessageCircle className="h-4 w-4 text-[#D4AF37]" />
              Quick support
            </div>

            <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2 text-xs text-zinc-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-zinc-400">
              <Mail className="h-4 w-4 text-[#D4AF37]" />
              Email support
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}