"use client";

import { motion } from "framer-motion";
import {
  Compass,
  MapPin,
  Sparkles,
} from "lucide-react";

export default function ExploreHero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#070707]">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=2200&q=90)",
        }}
      />

      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-[#070707]" />

      <motion.div
        animate={{
          x: [0, 80, 0],
          y: [0, -30, 0],
          scale: [1, 1.12, 1],
        }}
        transition={{
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute left-[10%] top-[20%] h-64 w-64 rounded-full bg-[#D4AF37]/20 blur-[120px]"
      />

      <div className="relative z-10 mx-auto flex min-h-[560px] max-w-7xl items-center px-5 pb-24 pt-32 sm:px-8 lg:px-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.07] px-4 py-2 text-xs font-semibold text-white/70 backdrop-blur-xl"
          >
            <Compass className="h-4 w-4 text-[#F5D76E]" />
            Explore Sri Lanka
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.1,
            }}
            className="mt-7 max-w-4xl text-5xl font-black tracking-[-0.055em] text-white sm:text-6xl lg:text-8xl"
          >
            Find a place
            <span className="block text-[#F5D76E]">
              worth staying for.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.2,
            }}
            className="mt-6 max-w-2xl text-base leading-7 text-white/60 sm:text-lg"
          >
            Explore hotels, resorts, villas and unique stays
            across the most beautiful destinations in Sri Lanka.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              delay: 0.35,
            }}
            className="mt-8 flex flex-wrap gap-3 text-xs text-white/50"
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-[#F5D76E]" />
              25+ destinations
            </span>

            <span className="text-white/20">•</span>

            <span className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-[#F5D76E]" />
              Curated stays
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}