"use client";

import { motion } from "framer-motion";
import {
  Compass,
  MapPinned,
  Search,
  Sparkles,
  WalletCards,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Find the right stay",
    description:
      "Search hotels using destinations, dates, guests, price and preferences.",
  },
  {
    icon: MapPinned,
    title: "Discover nearby",
    description:
      "Explore stays around your current location or your next destination.",
  },
  {
    icon: WalletCards,
    title: "Better value",
    description:
      "Find exclusive deals and competitive prices for your next trip.",
  },
  {
    icon: Sparkles,
    title: "Curated experiences",
    description:
      "Discover stays selected to make your Sri Lankan journey special.",
  },
  {
    icon: Zap,
    title: "Simple booking",
    description:
      "A smooth booking experience designed to get you from search to stay faster.",
  },
  {
    icon: Compass,
    title: "Explore Sri Lanka",
    description:
      "From beaches to mountains, discover destinations across the island.",
  },
];

export default function AboutFeatures() {
  return (
    <section className="border-y border-zinc-200 bg-white py-24 dark:border-white/[0.07] dark:bg-[#080808]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            Built for travelers
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Everything you need
            <br />
            <span className="text-[#D4AF37]">
              for your next stay.
            </span>
          </h2>

          <p className="mt-5 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            BookingLK combines discovery, deals and booking
            into one modern travel experience.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                className="group rounded-[24px] border border-zinc-200 bg-zinc-50 p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:bg-white hover:shadow-xl dark:border-white/[0.08] dark:bg-white/[0.02] dark:hover:bg-white/[0.04]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10 transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <h3 className="mt-6 text-lg font-bold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}