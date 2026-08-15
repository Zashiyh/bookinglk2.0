"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItemProps {
  question: string;
  answer: string;
}

export default function FAQItem({
  question,
  answer,
}: FAQItemProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white transition hover:border-[#D4AF37]/40 dark:border-white/10 dark:bg-[#111111]">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-6 px-5 py-5 text-left sm:px-6"
        aria-expanded={open}
      >
        <span className="text-sm font-semibold text-zinc-900 dark:text-white sm:text-base">
          {question}
        </span>

        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-100 transition-transform dark:bg-white/5 ${
            open ? "rotate-180" : ""
          }`}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      <div
        className={`grid transition-all duration-300 ${
          open
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="border-t border-zinc-200 px-5 pb-5 pt-4 text-sm leading-7 text-zinc-600 dark:border-white/10 dark:text-zinc-400 sm:px-6">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
}