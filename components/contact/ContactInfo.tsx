"use client";

import { motion } from "framer-motion";
import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
} from "lucide-react";

const contactItems = [
  {
    icon: Mail,
    title: "Email us",
    value: "support@bookinglk.com",
    description: "For general questions and support.",
  },
  {
    icon: Phone,
    title: "Call us",
    value: "+94 11 234 5678",
    description: "Available during support hours.",
  },
  {
    icon: MapPin,
    title: "Our location",
    value: "Colombo, Sri Lanka",
    description: "Serving travelers across Sri Lanka.",
  },
];

export default function ContactInfo() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
        Get in touch
      </p>

      <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
        How can we
        <br />
        <span className="text-[#D4AF37]">help you?</span>
      </h2>

      <p className="mt-5 max-w-md text-sm leading-7 text-zinc-500 dark:text-zinc-400">
        Whether you need help with a reservation or simply
        want to know more about BookingLK, our team is ready
        to help.
      </p>

      <div className="mt-9 space-y-4">
        {contactItems.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="group rounded-2xl border border-zinc-200 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37]/30 hover:shadow-lg dark:border-white/[0.08] dark:bg-[#0c0c0c]"
            >
              <div className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <Icon className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
                    {item.title}
                  </p>

                  <p className="mt-1 truncate text-sm font-bold">
                    {item.value}
                  </p>

                  <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/5 p-5">
        <div className="flex gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#D4AF37]/10">
            <Clock3 className="h-5 w-5 text-[#D4AF37]" />
          </div>

          <div>
            <p className="font-bold">Support hours</p>

            <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
              Monday – Sunday
            </p>

            <p className="mt-1 text-xs text-zinc-400">
              8:00 AM – 10:00 PM
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}