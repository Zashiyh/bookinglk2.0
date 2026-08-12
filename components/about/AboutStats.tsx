"use client";

import { motion } from "framer-motion";
import {
  Building2,
  MapPinned,
  ShieldCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    value: "100+",
    label: "Hotel partners",
    icon: Building2,
  },
  {
    value: "25+",
    label: "Destinations",
    icon: MapPinned,
  },
  {
    value: "10K+",
    label: "Travelers",
    icon: Users,
  },
  {
    value: "24/7",
    label: "Booking support",
    icon: ShieldCheck,
  },
];

export default function AboutStats() {
  return (
    <section className="border-b border-zinc-200 bg-white dark:border-white/[0.07] dark:bg-[#080808]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y divide-zinc-200 px-4 sm:px-6 lg:grid-cols-4 lg:px-8 lg:divide-y-0 dark:divide-white/[0.07]">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: index * 0.08,
              }}
              className="flex flex-col items-center justify-center px-5 py-10 text-center"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                <Icon className="h-5 w-5 text-[#D4AF37]" />
              </div>

              <p className="text-2xl font-black tracking-tight sm:text-3xl">
                {stat.value}
              </p>

              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                {stat.label}
              </p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}