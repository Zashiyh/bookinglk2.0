"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CalendarDays,
  Percent,
  Sparkles,
  Tag,
} from "lucide-react";

import { Navbar } from "@/components/navbar/navbar";


interface Deal {
  _id: string;
  title: string;
  slug: string;
  description: string;

  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;

  originalPrice: number;
  dealPrice: number;

  currency: "LKR";

  startDate: string;
  endDate: string;

  promoCode?: string;
  image?: string;

  isFeatured: boolean;
  isPublished: boolean;

  hotelId?: {
    _id: string;
    name: string;
    slug: string;
    location?: {
      city?: string;
    };
  };
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDeals() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/deals", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Failed to load deals."
          );
        }

        setDeals(
          Array.isArray(result.data)
            ? result.data
            : []
        );
      } catch (error) {
        console.error("Deals fetch error:", error);

        setError(
          "We couldn't load the latest deals. Please try again."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#050505] dark:text-white">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-zinc-50 pt-32 dark:border-white/10 dark:bg-[#080808]">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-7xl px-4 pb-16 text-center sm:px-6 lg:px-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#B8860B] dark:text-[#F5D76E]">
            <Sparkles className="h-4 w-4" />
            Exclusive Offers
          </div>

          <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Stay more.
            <span className="text-[#D4AF37]">
              {" "}
              Spend less.
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-500 dark:text-zinc-400 sm:text-base">
            Discover exclusive hotel deals, limited-time
            offers and special rates across Sri Lanka.
          </p>
        </div>
      </section>

      {/* DEALS */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        {loading && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse overflow-hidden rounded-3xl border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#111]"
              >
                <div className="h-60 bg-zinc-200 dark:bg-white/5" />
                <div className="space-y-4 p-6">
                  <div className="h-5 w-2/3 rounded bg-zinc-200 dark:bg-white/5" />
                  <div className="h-4 w-full rounded bg-zinc-200 dark:bg-white/5" />
                  <div className="h-10 w-full rounded bg-zinc-200 dark:bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
            <h2 className="text-xl font-semibold">
              Something went wrong
            </h2>

            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
              {error}
            </p>
          </div>
        )}

        {!loading &&
          !error &&
          deals.length === 0 && (
            <div className="rounded-3xl border border-dashed border-zinc-300 p-12 text-center dark:border-white/10">
              <Tag className="mx-auto h-10 w-10 text-[#D4AF37]" />

              <h2 className="mt-5 text-xl font-semibold">
                No deals available
              </h2>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Check back soon for exclusive BookingLK
                offers.
              </p>
            </div>
          )}

        {!loading &&
          !error &&
          deals.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {deals.map((deal) => (
                <Link
                  key={deal._id}
                  href={`/deals/${deal.slug || deal._id}`}
                  className="group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl dark:border-white/10 dark:bg-[#111]"
                >
                  {/* IMAGE */}
                  <div className="relative h-60 overflow-hidden bg-zinc-100 dark:bg-white/5">
                    {deal.image ? (
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-zinc-900">
                        <Sparkles className="h-10 w-10 text-[#D4AF37]" />
                      </div>
                    )}

                    {/* DISCOUNT */}
                    <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#D4AF37] px-3 py-1.5 text-xs font-bold text-black">
                      <Percent className="h-3.5 w-3.5" />

                      {deal.discountType === "PERCENTAGE"
                        ? `${deal.discountValue}% OFF`
                        : `LKR ${deal.discountValue.toLocaleString()} OFF`}
                    </div>

                    {deal.isFeatured && (
                      <div className="absolute right-4 top-4 rounded-full bg-black/70 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
                        Featured
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-6">
                    {deal.hotelId?.name && (
                      <p className="text-xs font-semibold uppercase tracking-wider text-[#B8860B] dark:text-[#F5D76E]">
                        {deal.hotelId.name}
                      </p>
                    )}

                    <h2 className="mt-2 text-xl font-semibold transition group-hover:text-[#B8860B] dark:group-hover:text-[#F5D76E]">
                      {deal.title}
                    </h2>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      {deal.description}
                    </p>

                    {/* PRICE */}
                    <div className="mt-5 flex items-end justify-between">
                      <div>
                        <p className="text-xs text-zinc-400">
                          From
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xl font-bold">
                            LKR{" "}
                            {deal.dealPrice.toLocaleString()}
                          </span>

                          <span className="text-sm text-zinc-400 line-through">
                            LKR{" "}
                            {deal.originalPrice.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 transition group-hover:bg-[#D4AF37] dark:bg-white/10">
                        <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:text-black" />
                      </span>
                    </div>

                    {/* DATE */}
                    <div className="mt-5 flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-400 dark:border-white/10">
                      <CalendarDays className="h-4 w-4" />

                      Valid until{" "}
                      {new Date(
                        deal.endDate
                      ).toLocaleDateString("en-LK")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
      </section>

  
    </main>
  );
}