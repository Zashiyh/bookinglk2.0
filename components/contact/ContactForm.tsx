"use client";

import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquare,
  Send,
  User,
} from "lucide-react";

const subjects = [
  "General enquiry",
  "Booking support",
  "Payment issue",
  "Hotel enquiry",
  "Cancellation",
  "Technical issue",
  "Other",
];

export default function ContactForm() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    // Temporary frontend behaviour.
    // Connect this to /api/contact when backend is ready.
    await new Promise((resolve) =>
      setTimeout(resolve, 1200)
    );

    setLoading(false);
    setSent(true);
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex min-h-[520px] flex-col items-center justify-center rounded-[32px] border border-[#D4AF37]/20 bg-white p-8 text-center shadow-xl dark:border-white/10 dark:bg-[#0c0c0c]"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
          <CheckCircle2 className="h-8 w-8 text-[#D4AF37]" />
        </div>

        <h2 className="mt-6 text-2xl font-black">
          Message sent
        </h2>

        <p className="mt-3 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
          Thanks for reaching out. Our team will review your
          message and get back to you as soon as possible.
        </p>

        <button
          type="button"
          onClick={() => setSent(false)}
          className="mt-7 rounded-xl border border-zinc-200 px-5 py-3 text-sm font-semibold transition hover:border-[#D4AF37]/40 dark:border-white/10"
        >
          Send another message
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 25 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="rounded-[32px] border border-zinc-200 bg-white p-6 shadow-xl dark:border-white/[0.08] dark:bg-[#0c0c0c] sm:p-8"
    >
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
          Send a message
        </p>

        <h2 className="mt-3 text-2xl font-black">
          Tell us what you need.
        </h2>

        <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
          Fill in the form and we'll get back to you.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label className="mb-2 block text-xs font-semibold">
              Full name
            </label>

            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <input
                required
                name="name"
                type="text"
                placeholder="Your name"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-white/[0.03]"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold">
              Email address
            </label>

            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <input
                required
                name="email"
                type="email"
                placeholder="you@example.com"
                className="h-12 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-white/[0.03]"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold">
            Subject
          </label>

          <select
            name="subject"
            defaultValue=""
            className="h-12 w-full appearance-none rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-white/[0.03]"
            required
          >
            <option value="" disabled>
              Select a subject
            </option>

            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold">
            Message
          </label>

          <div className="relative">
            <MessageSquare className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-zinc-400" />

            <textarea
              required
              name="message"
              rows={6}
              placeholder="How can we help?"
              className="w-full resize-none rounded-xl border border-zinc-200 bg-zinc-50 py-3.5 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-white/[0.03]"
            />
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-sm font-bold text-black transition hover:bg-[#F5D76E] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send message
              <Send className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </motion.div>
  );
}