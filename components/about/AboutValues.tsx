"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Globe2,
  ShieldCheck,
  UsersRound,
} from "lucide-react";

const values = [
  {
    icon: ShieldCheck,
    title: "Trust",
    description:
      "We believe travelers deserve clear information and a booking experience they can rely on.",
  },
  {
    icon: UsersRound,
    title: "People first",
    description:
      "We design around real travelers and the businesses that make Sri Lanka worth exploring.",
  },
  {
    icon: Globe2,
    title: "Local discovery",
    description:
      "We want more travelers to discover the diverse destinations and stays across Sri Lanka.",
  },
  {
    icon: CheckCircle2,
    title: "Simplicity",
    description:
      "Every part of BookingLK is designed to reduce friction and make travel planning easier.",
  },
];

export default function AboutValues() {
  return (
    <section className="bg-[#fafafa] py-24 dark:bg-[#050505]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              What drives us
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Built with
              <br />
              <span className="text-[#D4AF37]">
                purpose.
              </span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400">
              We are building BookingLK around a simple idea:
              travel should feel exciting before the journey even
              begins.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.08,
                  }}
                  className="rounded-[24px] border border-zinc-200 bg-white p-6 dark:border-white/[0.08] dark:bg-[#0c0c0c]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                    <Icon className="h-5 w-5 text-[#D4AF37]" />
                  </div>

                  <h3 className="mt-5 font-bold">
                    {value.title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}