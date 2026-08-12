"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "How can I get help with an existing booking?",
    answer:
      "Contact our support team with your booking details and we'll help you with your reservation.",
  },
  {
    question: "Can I contact a hotel directly?",
    answer:
      "Hotel contact information and relevant property details can be provided through the booking process where available.",
  },
  {
    question: "What if I need to cancel my booking?",
    answer:
      "Cancellation depends on the property's cancellation policy. Check your booking details for the applicable terms.",
  },
  {
    question: "Can hotels partner with BookingLK?",
    answer:
      "Yes. Hotel owners and managers can contact our team to learn more about listing their property on BookingLK.",
  },
];

export default function ContactFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="border-y border-zinc-200 bg-white py-24 dark:border-white/[0.07] dark:bg-[#080808]">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
            FAQ
          </p>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Frequently asked
            <br />
            <span className="text-[#D4AF37]">
              questions.
            </span>
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = open === index;

            return (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.05,
                }}
                className="overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-50 dark:border-white/[0.08] dark:bg-white/[0.02]"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpen(isOpen ? null : index)
                  }
                  className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left sm:px-6"
                >
                  <span className="text-sm font-bold">
                    {faq.question}
                  </span>

                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-zinc-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-[#D4AF37]" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-all duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-5 text-sm leading-6 text-zinc-500 dark:text-zinc-400 sm:px-6">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}