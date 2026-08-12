"use client";

import { motion } from "framer-motion";
import {
  Heart,
  MapPin,
  Target,
} from "lucide-react";

export default function AboutMission() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] py-24 dark:bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[32px] border border-zinc-200 bg-gradient-to-br from-[#D4AF37]/20 via-zinc-900 to-black shadow-2xl dark:border-white/10">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(212,175,55,0.25),transparent_40%)]" />

              <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-20 w-20 items-center justify-center rounded-3xl border border-[#D4AF37]/30 bg-[#D4AF37]/10 backdrop-blur-xl">
                  <MapPin className="h-9 w-9 text-[#F5D76E]" />
                </div>

                <h3 className="mt-6 text-2xl font-black text-white">
                  One island.
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  Endless places to discover.
                </p>

                <div className="mt-8 flex gap-2">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <span
                      key={item}
                      className="h-1.5 w-8 rounded-full bg-[#D4AF37]/60"
                    />
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              Why we exist
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Making every stay
              <br />
              <span className="text-[#D4AF37]">
                easier to find.
              </span>
            </h2>

            <p className="mt-6 text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
              Finding the right place to stay should not feel
              complicated. BookingLK brings hotels, villas,
              resorts and unique stays together in one simple
              platform designed for travelers exploring Sri Lanka.
            </p>

            <p className="mt-5 text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
              Whether you are planning a weekend in Kandy,
              a beach escape in the south, a mountain adventure
              in Ella or a city stay in Colombo, we help you
              find a place that fits your journey.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <Target className="h-5 w-5 text-[#D4AF37]" />

                <h3 className="mt-3 font-bold">
                  Our mission
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Make hotel discovery and booking effortless
                  for every traveler.
                </p>
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <Heart className="h-5 w-5 text-[#D4AF37]" />

                <h3 className="mt-3 font-bold">
                  Our promise
                </h3>

                <p className="mt-2 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                  Better choices, transparent information and
                  memorable stays.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}