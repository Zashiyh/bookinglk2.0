"use client";

import { useEffect, useMemo, useState } from "react";
import DealCard, {
  PublicDeal,
} from "./DealCard";
import DealCardSkeleton from "./DealCardSkeleton";
import DealFilters from "./DealFilters";

export default function FeaturedDeals() {
  const [deals, setDeals] = useState<PublicDeal[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState<
    "ALL" | "PERCENTAGE" | "FIXED"
  >("ALL");

  useEffect(() => {
    async function loadDeals() {
      try {
        setLoading(true);

        const response = await fetch(
          "/api/deals",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Failed to load deals."
          );
        }

        setDeals(
          Array.isArray(result.deals)
            ? result.deals
            : []
        );
      } catch (error) {
        console.error(
          "LOAD PUBLIC DEALS ERROR:",
          error
        );

        setDeals([]);
      } finally {
        setLoading(false);
      }
    }

    loadDeals();
  }, []);

  const filteredDeals = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return deals.filter((deal) => {
      const matchesSearch =
        !query ||
        deal.title
          .toLowerCase()
          .includes(query) ||
        deal.hotelId?.name
          ?.toLowerCase()
          .includes(query) ||
        deal.hotelId?.location?.city
          ?.toLowerCase()
          .includes(query);

      const matchesType =
        type === "ALL" ||
        deal.discountType === type;

      return matchesSearch && matchesType;
    });
  }, [deals, search, type]);

  return (
    <section className="bg-[#080808] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <p className="mb-3 text-xs font-black uppercase tracking-[0.25em] text-yellow-400">
            Exclusive Offers
          </p>

          <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
            Best Hotel Deals
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/45">
            Discover exclusive hotel offers and
            limited-time discounts across Sri Lanka.
          </p>
        </div>

        <DealFilters
          search={search}
          setSearch={setSearch}
          type={type}
          setType={setType}
        />

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map(
              (_, index) => (
                <DealCardSkeleton
                  key={index}
                />
              )
            )}
          </div>
        ) : filteredDeals.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center">
            <p className="text-lg font-bold text-white">
              No deals available
            </p>

            <p className="mt-2 text-sm text-white/40">
              Try another search or check back
              later for new offers.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredDeals.map((deal) => (
              <DealCard
                key={deal._id}
                deal={deal}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}