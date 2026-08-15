"use client";

import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  CreditCard,
  HelpCircle,
  Hotel,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Smartphone,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import FAQItem from "./FAQItem";

type FAQCategory =
  | "All"
  | "Getting Started"
  | "Bookings"
  | "Payments"
  | "Cancellations"
  | "Account"
  | "Hotels";

interface FAQ {
  id: number;
  category: Exclude<FAQCategory, "All">;
  question: string;
  answer: string;
}

const categories: {
  name: FAQCategory;
  icon: React.ElementType;
}[] = [
  {
    name: "All",
    icon: HelpCircle,
  },
  {
    name: "Getting Started",
    icon: BookOpen,
  },
  {
    name: "Bookings",
    icon: Hotel,
  },
  {
    name: "Payments",
    icon: CreditCard,
  },
  {
    name: "Cancellations",
    icon: X,
  },
  {
    name: "Account",
    icon: UserRound,
  },
  {
    name: "Hotels",
    icon: ShieldCheck,
  },
];

const faqs: FAQ[] = [
  {
    id: 1,
    category: "Getting Started",
    question: "What is BookingLK?",
    answer:
      "BookingLK is a hotel booking platform designed to help travelers discover hotels, resorts, villas, guesthouses and other properties across Sri Lanka. You can compare properties, view available rooms and make your booking online.",
  },
  {
    id: 2,
    category: "Getting Started",
    question: "How do I find a hotel?",
    answer:
      "Use the search section on the BookingLK homepage to enter your destination, preferred dates and number of guests. You can then browse available properties and use filters to narrow down your results.",
  },
  {
    id: 3,
    category: "Getting Started",
    question: "Do I need an account to browse hotels?",
    answer:
      "No. You can browse hotels and view property information without creating an account. An account may be required for certain booking, review or account-management features.",
  },
  {
    id: 4,
    category: "Bookings",
    question: "How do I make a hotel booking?",
    answer:
      "Choose a hotel, open its property page, select an available room and continue to the booking checkout. Enter the required guest information and follow the instructions shown on the checkout page.",
  },
  {
    id: 5,
    category: "Bookings",
    question: "How do I know if a room is available?",
    answer:
      "Available rooms are displayed on the hotel's property page. Room availability can change based on reservations, dates and the hotel's inventory.",
  },
  {
    id: 6,
    category: "Bookings",
    question: "Where can I find my booking?",
    answer:
      "After completing a booking, you can view your booking information from your account dashboard when the booking-management feature is available for your account.",
  },
  {
    id: 7,
    category: "Bookings",
    question: "Will I receive a booking confirmation?",
    answer:
      "A successful booking should provide confirmation details. Depending on the BookingLK configuration and booking method, confirmation information may also be sent to the email address associated with your booking.",
  },
  {
    id: 8,
    category: "Bookings",
    question: "Can I make a booking for someone else?",
    answer:
      "Yes, where supported, you can make a reservation for another guest. Make sure the guest information entered during checkout is accurate and matches the requirements of the property.",
  },
  {
    id: 9,
    category: "Payments",
    question: "How do I pay for my booking?",
    answer:
      "Payment options depend on the booking and property configuration. The available payment method and any payment requirements should be displayed during the booking process before you confirm the reservation.",
  },
  {
    id: 10,
    category: "Payments",
    question: "Is my payment information secure?",
    answer:
      "BookingLK is designed with security in mind. Payment information should be handled through the configured payment provider rather than being stored directly in the application whenever the payment gateway integration is used.",
  },
  {
    id: 11,
    category: "Payments",
    question: "Why was my payment unsuccessful?",
    answer:
      "A payment can fail because of insufficient funds, incorrect card information, bank restrictions, payment-gateway issues or connectivity problems. Check the information you entered and try again. If the issue continues, contact your bank or BookingLK support.",
  },
  {
    id: 12,
    category: "Cancellations",
    question: "Can I cancel my booking?",
    answer:
      "Cancellation depends on the cancellation policy attached to your booking and the property. Always check the cancellation terms before confirming your reservation.",
  },
  {
    id: 13,
    category: "Cancellations",
    question: "Will I get a refund after cancelling?",
    answer:
      "A refund depends on the cancellation and payment policy associated with your booking. Some bookings may allow free cancellation while others may have cancellation charges or be non-refundable.",
  },
  {
    id: 14,
    category: "Cancellations",
    question: "Can I change my booking dates?",
    answer:
      "Date changes depend on the booking conditions, room availability and property policy. If modification is supported, use your booking-management options or contact the property/support team.",
  },
  {
    id: 15,
    category: "Account",
    question: "How do I create a BookingLK account?",
    answer:
      "Open the registration page from the BookingLK navigation, enter the required information and complete the registration process. After registration, you can sign in to access account features.",
  },
  {
    id: 16,
    category: "Account",
    question: "I forgot my password. What should I do?",
    answer:
      "Use the password recovery option on the login page. Follow the instructions provided to reset your password. If you cannot access your account, contact BookingLK support.",
  },
  {
    id: 17,
    category: "Account",
    question: "Can I update my profile information?",
    answer:
      "Yes, supported profile information can be managed from your account dashboard. Keep your contact information up to date so booking-related communications can reach you.",
  },
  {
    id: 18,
    category: "Hotels",
    question: "What does BookingLK Verified mean?",
    answer:
      "The BookingLK Verified label is intended to identify properties that have passed the platform's configured verification process. Verification does not replace your own review of property information and policies.",
  },
  {
    id: 19,
    category: "Hotels",
    question: "How can I see hotel amenities?",
    answer:
      "Open the hotel's property details page. Available amenities such as Wi-Fi, parking, swimming pools, restaurants and other facilities are displayed when provided by the property.",
  },
  {
    id: 20,
    category: "Hotels",
    question: "How can I leave a hotel review?",
    answer:
      "If your BookingLK account and booking are eligible for reviews, you can use the review option on the hotel details page. Reviews may be restricted to guests with completed stays to help keep feedback trustworthy.",
  },
];

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] =
    useState<FAQCategory>("All");

  const filteredFAQs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return faqs.filter((faq) => {
      const matchesCategory =
        activeCategory === "All" ||
        faq.category === activeCategory;

      if (!query) {
        return matchesCategory;
      }

      const searchableText = [
        faq.question,
        faq.answer,
        faq.category,
      ]
        .join(" ")
        .toLowerCase();

      return (
        matchesCategory &&
        searchableText.includes(query)
      );
    });
  }, [search, activeCategory]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#fafafa] text-zinc-950 dark:bg-[#050505] dark:text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-10%] top-[5%] h-[420px] w-[420px] rounded-full bg-[#D4AF37]/5 blur-[120px]" />

        <div className="absolute right-[-15%] top-[25%] h-[500px] w-[500px] rounded-full bg-purple-500/5 blur-[140px]" />

        <div className="absolute bottom-[-15%] left-[30%] h-[450px] w-[450px] rounded-full bg-[#D4AF37]/5 blur-[140px]" />
      </div>

      {/* Hero */}
      <section className="relative">
        <div className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 sm:pt-12 lg:px-8 lg:pb-20">
          <Link
            href="/"
            className="group inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm transition hover:-translate-y-0.5 hover:border-[#D4AF37] dark:border-white/10 dark:bg-[#111111]"
          >
            <ArrowRight className="h-4 w-4 rotate-180 transition-transform group-hover:-translate-x-1" />

            Back to BookingLK
          </Link>

          <div className="mx-auto mt-14 max-w-3xl text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <HelpCircle className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.2em] text-[#B8860B] dark:text-[#F5D76E]">
              BookingLK Support
            </p>

            <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              How can we help?
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-zinc-600 dark:text-zinc-400 sm:text-lg">
              Find answers about hotel bookings,
              payments, cancellations, your account
              and everything you need for a smoother
              stay.
            </p>

            {/* Search */}
            <div className="mx-auto mt-8 max-w-2xl">
              <div className="relative">
                <Search className="pointer-events-none absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search for answers..."
                  className="h-16 w-full rounded-2xl border border-zinc-200 bg-white pl-14 pr-12 text-sm shadow-xl outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-4 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111] sm:text-base"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-zinc-100 text-zinc-500 transition hover:bg-zinc-200 dark:bg-white/10 dark:hover:bg-white/15"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category navigation */}
      <section className="border-y border-zinc-200/70 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-[#090909]/70">
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-max items-center gap-2">
            {categories.map((category) => {
              const Icon = category.icon;

              const active =
                activeCategory === category.name;

              return (
                <button
                  key={category.name}
                  type="button"
                  onClick={() =>
                    setActiveCategory(category.name)
                  }
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition ${
                    active
                      ? "bg-[#D4AF37] text-black shadow-sm"
                      : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-400 dark:hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />

                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
              Frequently asked questions
            </p>

            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Find your answer
            </h2>
          </div>

          <p className="text-sm text-zinc-500">
            {filteredFAQs.length}{" "}
            {filteredFAQs.length === 1
              ? "answer"
              : "answers"}
          </p>
        </div>

        {filteredFAQs.length > 0 ? (
          <div className="space-y-3">
            {filteredFAQs.map((faq) => (
              <FAQItem
                key={faq.id}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-dashed border-zinc-300 bg-white p-12 text-center dark:border-white/10 dark:bg-[#111111]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <Search className="h-7 w-7 text-[#D4AF37]" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              No results found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              We couldn't find an answer matching
              your search. Try another keyword or
              contact our support team.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearch("");
                setActiveCategory("All");
              }}
              className="mt-6 rounded-full bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
            >
              Clear search
            </button>
          </div>
        )}
      </section>

      {/* Quick help */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/hotels"
            className="group rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#111111]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <Hotel className="h-6 w-6 text-[#D4AF37]" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Find a hotel
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Explore hotels, resorts and stays
              across Sri Lanka.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
              Browse hotels
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/account/bookings"
            className="group rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#111111]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <BookOpen className="h-6 w-6 text-[#D4AF37]" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Manage your booking
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              View your reservations and manage
              your upcoming stays.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
              My bookings
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>

          <Link
            href="/contact"
            className="group rounded-[2rem] border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#D4AF37]/40 hover:shadow-xl dark:border-white/10 dark:bg-[#111111]"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
              <MessageCircle className="h-6 w-6 text-[#D4AF37]" />
            </div>

            <h3 className="mt-5 text-lg font-semibold">
              Contact support
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Still need help? Our support team is
              ready to assist you.
            </p>

            <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#B8860B] dark:text-[#F5D76E]">
              Get in touch
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </div>
      </section>

      {/* Support CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8 lg:pb-24">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-[#111111] px-6 py-12 text-white shadow-2xl sm:px-10 lg:px-14 lg:py-14">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />

          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-zinc-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#F5D76E]" />

                We're here to help
              </div>

              <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
                Still need a hand?
              </h2>

              <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                If you can't find what you're looking
                for, reach out to the BookingLK support
                team and we'll help you with your
                booking.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="mailto:support@bookinglk.com"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#D4AF37] px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
              >
                <Mail className="h-4 w-4" />

                Email support
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                <MessageCircle className="h-4 w-4" />

                Contact us
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer note */}
      <footer className="border-t border-zinc-200 py-8 dark:border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 text-center text-xs text-zinc-500 sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p>
            © {new Date().getFullYear()} BookingLK.
            All rights reserved.
          </p>

          <div className="flex items-center gap-2">
            <Smartphone className="h-3.5 w-3.5" />

            <span>
              Built for easier stays across Sri
              Lanka.
            </span>
          </div>
        </div>
      </footer>
    </main>
  );
}