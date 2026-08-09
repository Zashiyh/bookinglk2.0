"use client";

import { motion } from "framer-motion";
import {
  ArrowDown,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { FadeIn } from "@/components/animations/fade-in";
import { HotelSearch } from "@/components/search/hotel-search";

export function HeroSection() {
  return (
    <section className="relative min-h-[850px] overflow-hidden bg-black">
      {/* Background */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=2400&q=85')",
          }}
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Cinematic gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/35 to-black" />
      </div>

      {/* Gold ambient glow */}
      <div className="absolute left-1/2 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-[var(--gold)]/10 blur-[140px]" />

      {/* Content */}
      <div className="relative z-10 flex min-h-[850px] items-center">
        <div className="container-booking w-full pb-20 pt-32">
          <div className="mx-auto max-w-5xl text-center">

            {/* Badge */}
            <FadeIn>
              <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-xl">
                <Sparkles
                  size={14}
                  className="text-[var(--gold-bright)]"
                />

                Sri Lanka's stay discovery platform
              </div>
            </FadeIn>

            {/* Heading */}
            <FadeIn delay={0.1}>
              <h1 className="mt-7 font-[var(--font-manrope)] text-5xl font-extrabold leading-[1.02] tracking-[-0.04em] text-white sm:text-6xl md:text-7xl lg:text-8xl">
                Discover Your
                <br />

                <span className="gold-gradient">
                  Perfect Stay
                </span>

                <br />

                in Sri Lanka.
              </h1>
            </FadeIn>

            {/* Subtitle */}
            <FadeIn delay={0.2}>
              <p className="mx-auto mt-7 max-w-2xl text-base leading-7 text-white/65 sm:text-lg">
                Find hotels, resorts, villas and unique stays
                wherever your journey takes you.
              </p>
            </FadeIn>

            {/* Search */}
            <HotelSearch />

            {/* Trust indicators */}
            <FadeIn delay={0.7}>
              <div className="mt-7 flex flex-wrap items-center justify-center gap-5 text-xs text-white/55">

                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={15}
                    className="text-[var(--gold-bright)]"
                  />

                  Secure booking
                </div>

                <div className="flex items-center gap-2">
                  <MapPin
                    size={15}
                    className="text-[var(--gold-bright)]"
                  />

                  Stays across Sri Lanka
                </div>

                <div className="flex items-center gap-2">
                  <Sparkles
                    size={15}
                    className="text-[var(--gold-bright)]"
                  />

                  Verified properties
                </div>

              </div>
            </FadeIn>

          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-7 left-1/2 -translate-x-1/2 text-white/40"
      >
        <ArrowDown
          size={20}
          className="animate-bounce"
        />
      </motion.div>
    </section>
  );
}