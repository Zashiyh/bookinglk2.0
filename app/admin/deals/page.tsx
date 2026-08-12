"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Edit3,
  Percent,
  Plus,
  RefreshCw,
  Search,
  Tag,
  Trash2,
  XCircle,
} from "lucide-react";

interface DealHotel {
  _id?: string;
  name?: string;
  slug?: string;
  location?: {
    city?: string;
    country?: string;
    [key: string]: unknown;
  };
  images?: string[];
}

interface Deal {
  _id: string;
  hotelId?: string | DealHotel;

  title?: string;
  slug?: string;
  description?: string;

  discountType?: "PERCENTAGE" | "FIXED";
  discountValue?: number;

  // Compatibility with older deal documents
  discountPercentage?: number;

  originalPrice?: number;
  dealPrice?: number;
  currency?: string;

  startDate?: string;
  endDate?: string;

  maxBookings?: number;
  bookingsCount?: number;

  promoCode?: string;
  image?: string;

  category?: string;

  isFeatured?: boolean;
  isPublished?: boolean;

  // Compatibility with older API responses
  isActive?: boolean;

  hotel?: DealHotel | null;

  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse {
  success?: boolean;
  message?: string;
  deals?: Deal[];
  data?: Deal[];
}

function normalizeDeal(deal: Deal): Deal {
  let hotel: DealHotel | null = deal.hotel ?? null;

  if (!hotel && deal.hotelId && typeof deal.hotelId === "object") {
    hotel = deal.hotelId;
  }

  const start = deal.startDate
    ? new Date(deal.startDate).getTime()
    : NaN;

  const end = deal.endDate
    ? new Date(deal.endDate).getTime()
    : NaN;

  const now = Date.now();

  const calculatedActive =
    !Number.isNaN(start) &&
    !Number.isNaN(end) &&
    start <= now &&
    end >= now &&
    Boolean(deal.isPublished);

  return {
    ...deal,
    hotel,
    isActive:
      typeof deal.isActive === "boolean"
        ? deal.isActive
        : calculatedActive,
  };
}

export default function AdminDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");

  const fetchDeals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/deals", {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await response.text();

      let result: ApiResponse | null = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          `Server returned invalid JSON (${response.status}).`
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to load deals."
        );
      }

      /*
       * Your API returns:
       *
       * {
       *   success: true,
       *   deals: [...]
       * }
       *
       * Older code was looking at result.data.
       */

      const rawDeals = Array.isArray(result.deals)
        ? result.deals
        : Array.isArray(result.data)
          ? result.data
          : [];

      const normalizedDeals = rawDeals.map(normalizeDeal);

      setDeals(normalizedDeals);
    } catch (err) {
      console.error("GET ADMIN DEALS ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load deals."
      );

      setDeals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeals();
  }, [fetchDeals]);

  const deleteDeal = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this deal?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(id);

      const response = await fetch(
        `/api/admin/deals/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json",
          },
        }
      );

      const text = await response.text();

      let result: ApiResponse | null = null;

      try {
        result = text ? JSON.parse(text) : null;
      } catch {
        throw new Error(
          `Server returned invalid JSON (${response.status}).`
        );
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message || "Failed to delete deal."
        );
      }

      setDeals((current) =>
        current.filter((deal) => deal._id !== id)
      );
    } catch (err) {
      console.error("DELETE DEAL ERROR:", err);

      window.alert(
        err instanceof Error
          ? err.message
          : "Failed to delete deal."
      );
    } finally {
      setDeleting(null);
    }
  };

  const filteredDeals = useMemo(() => {
    const query = search.trim().toLowerCase();

    return deals.filter((deal) => {
      const title =
        deal.title?.toLowerCase() ?? "";

      const hotel =
        deal.hotel?.name?.toLowerCase() ?? "";

      const city =
        deal.hotel?.location?.city?.toLowerCase() ?? "";

      const promo =
        deal.promoCode?.toLowerCase() ?? "";

      const description =
        deal.description?.toLowerCase() ?? "";

      const matchesSearch =
        !query ||
        title.includes(query) ||
        hotel.includes(query) ||
        city.includes(query) ||
        promo.includes(query) ||
        description.includes(query);

      const matchesStatus =
        status === "all" ||
        (status === "active" && deal.isActive) ||
        (status === "inactive" && !deal.isActive);

      return matchesSearch && matchesStatus;
    });
  }, [deals, search, status]);

  const stats = useMemo(() => {
    const active = deals.filter(
      (deal) => deal.isActive
    ).length;

    const featured = deals.filter(
      (deal) => deal.isFeatured
    ).length;

    const totalDiscount = deals.reduce(
      (sum, deal) => {
        const value =
          deal.discountPercentage ??
          deal.discountValue ??
          0;

        return sum + (Number(value) || 0);
      },
      0
    );

    const averageDiscount =
      deals.length > 0
        ? Math.round(
            totalDiscount / deals.length
          )
        : 0;

    const published = deals.filter(
      (deal) => deal.isPublished
    ).length;

    return {
      total: deals.length,
      active,
      featured,
      published,
      averageDiscount,
    };
  }, [deals]);

  const formatPrice = (
    value?: number,
    currency = "LKR"
  ) => {
    if (
      value === undefined ||
      value === null ||
      Number.isNaN(Number(value))
    ) {
      return "—";
    }

    try {
      return new Intl.NumberFormat("en-LK", {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(Number(value));
    } catch {
      return `LKR ${Number(value).toLocaleString()}`;
    }
  };

  const formatDate = (value?: string) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return date.toLocaleDateString("en-LK", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDiscount = (deal: Deal) => {
    const value =
      deal.discountPercentage ??
      deal.discountValue ??
      0;

    if (deal.discountType === "FIXED") {
      return `LKR ${Number(value).toLocaleString()}`;
    }

    return `${Number(value) || 0}%`;
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      {/* Header */}

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.08]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#F5D76E]">
                BookingLK Admin
              </p>

              <h1 className="text-lg font-semibold">
                Deals
              </h1>
            </div>
          </div>

          <Link
            href="/admin/deals/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black transition hover:bg-[#F5D76E]"
          >
            <Plus className="h-4 w-4" />
            New Deal
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}

        <div className="mb-8">
          <p className="text-sm text-zinc-400">
            Manage promotions and special offers.
          </p>

          <h2 className="mt-1 text-3xl font-semibold tracking-tight">
            Deal management
          </h2>
        </div>

        {/* Stats */}

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={<Tag className="h-5 w-5" />}
            label="Total Deals"
            value={stats.total}
          />

          <StatCard
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Active Deals"
            value={stats.active}
          />

          <StatCard
            icon={<Percent className="h-5 w-5" />}
            label="Avg. Discount"
            value={`${stats.averageDiscount}%`}
          />

          <StatCard
            icon={<Tag className="h-5 w-5" />}
            label="Featured"
            value={stats.featured}
          />
        </div>

        {/* Toolbar */}

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search deals, hotels or promo codes..."
                className="w-full rounded-xl border border-white/10 bg-black/30 py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-600 focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-2">
              {[
                "all",
                "active",
                "inactive",
              ].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setStatus(value)}
                  className={`rounded-xl px-4 py-2.5 text-sm font-medium capitalize transition ${
                    status === value
                      ? "bg-[#D4AF37] text-black"
                      : "border border-white/10 bg-white/[0.03] text-zinc-400 hover:bg-white/[0.08]"
                  }`}
                >
                  {value}
                </button>
              ))}

              <button
                type="button"
                onClick={fetchDeals}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition hover:bg-white/[0.08]"
                aria-label="Refresh deals"
              >
                <RefreshCw
                  className={`h-4 w-4 ${
                    loading
                      ? "animate-spin"
                      : ""
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Error */}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
            <div className="flex items-start gap-3">
              <XCircle className="mt-0.5 h-5 w-5 text-red-400" />

              <div>
                <p className="font-medium">
                  Failed to load deals
                </p>

                <p className="mt-1 text-sm text-zinc-400">
                  {error}
                </p>

                <button
                  type="button"
                  onClick={fetchDeals}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/70 hover:bg-white/5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Try again
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="mt-6 grid gap-4">
            {Array.from({ length: 5 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="h-32 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]"
                />
              )
            )}
          </div>
        )}

        {/* Empty */}

        {!loading &&
          !error &&
          filteredDeals.length === 0 && (
            <div className="mt-6 rounded-3xl border border-dashed border-white/10 bg-white/[0.02] p-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Tag className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <h3 className="mt-5 text-xl font-semibold">
                {deals.length === 0
                  ? "No deals found"
                  : "No matching deals"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500">
                {deals.length === 0
                  ? "Create your first promotion to get started."
                  : "Try changing your search or status filter."}
              </p>

              {deals.length === 0 && (
                <Link
                  href="/admin/deals/new"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
                >
                  <Plus className="h-4 w-4" />
                  Create Deal
                </Link>
              )}
            </div>
          )}

        {/* Deals */}

        {!loading &&
          !error &&
          filteredDeals.length > 0 && (
            <div className="mt-6 space-y-4">
              {filteredDeals.map((deal) => {
                const hotelName =
                  deal.hotel?.name ||
                  "Hotel not assigned";

                const city =
                  deal.hotel?.location?.city;

                return (
                  <article
                    key={deal._id}
                    className="group rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-[#D4AF37]/30 hover:bg-white/[0.05]"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      {/* Main */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-lg font-semibold">
                            {deal.title ||
                              "Untitled Deal"}
                          </h3>

                          {deal.isFeatured && (
                            <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-[11px] font-semibold text-[#F5D76E]">
                              FEATURED
                            </span>
                          )}

                          {deal.isPublished && (
                            <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                              PUBLISHED
                            </span>
                          )}

                          <span
                            className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              deal.isActive
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-zinc-500/10 text-zinc-400"
                            }`}
                          >
                            {deal.isActive
                              ? "ACTIVE"
                              : "INACTIVE"}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-zinc-400">
                          {hotelName}
                          {city
                            ? ` · ${city}`
                            : ""}
                        </p>

                        {deal.description && (
                          <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-6 text-zinc-500">
                            {deal.description}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-4 text-xs text-zinc-500">
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3.5 w-3.5" />

                            {formatDate(
                              deal.startDate
                            )}

                            {" — "}

                            {formatDate(
                              deal.endDate
                            )}
                          </span>

                          {deal.promoCode && (
                            <span className="inline-flex items-center gap-1.5">
                              <Tag className="h-3.5 w-3.5" />
                              {deal.promoCode}
                            </span>
                          )}

                          {deal.category && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock3 className="h-3.5 w-3.5" />
                              {deal.category}
                            </span>
                          )}

                          {typeof deal.bookingsCount ===
                            "number" && (
                            <span>
                              {deal.bookingsCount} bookings
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Pricing */}

                      <div className="flex items-center justify-between gap-6 lg:justify-end">
                        <div className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-sm text-zinc-600 line-through">
                              {formatPrice(
                                deal.originalPrice,
                                deal.currency ||
                                  "LKR"
                              )}
                            </span>

                            <span className="rounded-lg bg-red-500/10 px-2 py-1 text-xs font-bold text-red-400">
                              -
                              {getDiscount(
                                deal
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-xl font-bold text-[#F5D76E]">
                            {formatPrice(
                              deal.dealPrice,
                              deal.currency ||
                                "LKR"
                            )}
                          </p>

                          <p className="text-[11px] text-zinc-500">
                            per night
                          </p>
                        </div>

                        {/* Actions */}

                        <div className="flex items-center gap-2">
                          <Link
                            href={`/admin/deals/${deal._id}/edit`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] transition hover:border-[#D4AF37]/40 hover:bg-[#D4AF37]/10"
                            aria-label="Edit deal"
                          >
                            <Edit3 className="h-4 w-4" />
                          </Link>

                          <button
                            type="button"
                            disabled={
                              deleting ===
                              deal._id
                            }
                            onClick={() =>
                              deleteDeal(
                                deal._id
                              )
                            }
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/10 bg-red-500/5 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                            aria-label="Delete deal"
                          >
                            {deleting ===
                            deal._id ? (
                              <RefreshCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </button>

                          <Link
                            href={`/admin/deals/${deal._id}/edit`}
                            className="hidden h-10 items-center gap-1 rounded-xl border border-white/10 px-3 text-sm text-zinc-400 transition hover:bg-white/[0.05] sm:flex"
                          >
                            Manage

                            <ChevronRight className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10 text-[#F5D76E]">
          {icon}
        </div>

        <CircleDollarSign className="h-4 w-4 text-zinc-700" />
      </div>

      <p className="mt-5 text-sm text-zinc-500">
        {label}
      </p>

      <p className="mt-1 text-2xl font-semibold">
        {value}
      </p>
    </div>
  );
}