"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Pencil,
  Plus,
  Search,
  ShieldCheck,
  Trash2,
  XCircle,
} from "lucide-react";

interface Hotel {
  _id: string;
  name: string;
  slug: string;
  description: string;
  propertyType: string;
  location?: {
    address?: string;
    city?: string;
    district?: string;
    province?: string;
    country?: string;
  };
  rating?: number;
  reviewCount?: number;
  priceFrom?: number;
  currency?: string;
  amenities?: string[];
  images?: string[];
  isVerified?: boolean;
  isPublished?: boolean;
  createdAt?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const propertyTypes = [
  "HOTEL",
  "RESORT",
  "VILLA",
  "APARTMENT",
  "GUEST_HOUSE",
  "BOUTIQUE_HOTEL",
  "HOSTEL",
  "HOMESTAY",
];

function formatCurrency(value?: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [pagination, setPagination] =
    useState<Pagination | null>(null);

  const [search, setSearch] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [published, setPublished] = useState("");
  const [verified, setVerified] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(
    null
  );
  const [error, setError] = useState("");

  const loadHotels = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set("limit", "10");

      if (search.trim()) {
        params.set("search", search.trim());
      }

      if (propertyType) {
        params.set("propertyType", propertyType);
      }

      if (published) {
        params.set("published", published);
      }

      if (verified) {
        params.set("verified", verified);
      }

      const response = await fetch(
        `/api/admin/hotels?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to load hotels (${response.status})`
        );
      }

      setHotels(result.data || []);
      setPagination(result.pagination || null);
    } catch (err) {
      console.error("ADMIN_HOTELS_LOAD_ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load hotels."
      );
    } finally {
      setLoading(false);
    }
  }, [
    page,
    search,
    propertyType,
    published,
    verified,
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadHotels();
    }, 250);

    return () => clearTimeout(timer);
  }, [loadHotels]);

  async function updateHotel(
    id: string,
    data: Partial<Hotel>
  ) {
    try {
      setActionId(id);
      setError("");

      const response = await fetch(
        `/api/admin/hotels/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to update hotel (${response.status})`
        );
      }

      setHotels((current) =>
        current.map((hotel) =>
          hotel._id === id
            ? result.data
            : hotel
        )
      );
    } catch (err) {
      console.error("ADMIN_HOTEL_UPDATE_ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update hotel."
      );
    } finally {
      setActionId(null);
    }
  }

  async function deleteHotel(hotel: Hotel) {
    const confirmed = window.confirm(
      `Delete "${hotel.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionId(hotel._id);
      setError("");

      const response = await fetch(
        `/api/admin/hotels/${hotel._id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to delete hotel (${response.status})`
        );
      }

      setHotels((current) =>
        current.filter(
          (item) => item._id !== hotel._id
        )
      );

      await loadHotels();
    } catch (err) {
      console.error("ADMIN_HOTEL_DELETE_ERROR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete hotel."
      );
    } finally {
      setActionId(null);
    }
  }

  function resetFilters() {
    setSearch("");
    setPropertyType("");
    setPublished("");
    setVerified("");
    setPage(1);
  }

  return (
    <div className="min-h-full px-4 py-5 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-[1600px]">

        {/* HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]">
              <Building2 className="h-4 w-4" />
              Property management
            </div>

            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white sm:text-4xl">
              Hotels
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500 dark:text-zinc-400">
              Manage hotels, properties, publication status,
              verification and hotel information.
            </p>
          </div>

          <Link
            href="/admin/hotels/new"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/10 transition hover:-translate-y-0.5 hover:bg-[#e2c158]"
          >
            <Plus className="h-4 w-4" />
            Add hotel
          </Link>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* FILTERS */}
        <section className="mb-6 rounded-3xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-white/[0.025] sm:p-5">
          <div className="grid gap-3 xl:grid-cols-[minmax(280px,1fr)_180px_160px_160px_auto]">

            {/* SEARCH */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Search hotel or city..."
                className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-11 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
              />
            </div>

            {/* PROPERTY TYPE */}
            <select
              value={propertyType}
              onChange={(e) => {
                setPropertyType(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
            >
              <option value="">All types</option>

              {propertyTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replaceAll("_", " ")}
                </option>
              ))}
            </select>

            {/* PUBLISHED */}
            <select
              value={published}
              onChange={(e) => {
                setPublished(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
            >
              <option value="">Publication</option>
              <option value="true">Published</option>
              <option value="false">Unpublished</option>
            </select>

            {/* VERIFIED */}
            <select
              value={verified}
              onChange={(e) => {
                setVerified(e.target.value);
                setPage(1);
              }}
              className="h-11 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-white/[0.03] dark:text-white"
            >
              <option value="">Verification</option>
              <option value="true">Verified</option>
              <option value="false">Unverified</option>
            </select>

            <button
              type="button"
              onClick={resetFilters}
              className="h-11 rounded-xl border border-zinc-200 px-4 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 dark:border-white/10 dark:text-zinc-300 dark:hover:bg-white/5"
            >
              Reset
            </button>
          </div>
        </section>

        {/* TABLE */}
        <section className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[0.025]">

          <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-white/10">
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-white">
                All hotels
              </h2>

              <p className="mt-1 text-xs text-zinc-500">
                {pagination?.total ?? 0} properties
              </p>
            </div>

            {loading && (
              <Loader2 className="h-5 w-5 animate-spin text-[#D4AF37]" />
            )}
          </div>

          {loading && hotels.length === 0 ? (
            <div className="flex min-h-[320px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#D4AF37]" />
                <p className="mt-3 text-sm text-zinc-500">
                  Loading hotels...
                </p>
              </div>
            </div>
          ) : hotels.length === 0 ? (
            <div className="px-6 py-20 text-center">
              <Building2 className="mx-auto h-10 w-10 text-zinc-400" />

              <h3 className="mt-4 font-bold">
                No hotels found
              </h3>

              <p className="mt-2 text-sm text-zinc-500">
                Try changing your filters or add a new hotel.
              </p>

              <Link
                href="/admin/hotels/new"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
              >
                <Plus className="h-4 w-4" />
                Add hotel
              </Link>
            </div>
          ) : (
            <>
              {/* DESKTOP */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-zinc-200 text-xs uppercase tracking-wider text-zinc-500 dark:border-white/10">
                      <th className="px-5 py-4 font-semibold">
                        Hotel
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Type
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Location
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Price
                      </th>
                      <th className="px-5 py-4 font-semibold">
                        Status
                      </th>
                      <th className="px-5 py-4 text-right font-semibold">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 dark:divide-white/5">
                    {hotels.map((hotel) => (
                      <tr
                        key={hotel._id}
                        className="transition hover:bg-zinc-50 dark:hover:bg-white/[0.02]"
                      >
                        <td className="px-5 py-5">
                          <div className="flex min-w-[260px] items-center gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5">
                              {hotel.images?.[0] ? (
                                <img
                                  src={hotel.images[0]}
                                  alt={hotel.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <Building2 className="h-5 w-5 text-zinc-400" />
                              )}
                            </div>

                            <div className="min-w-0">
                              <p className="truncate font-bold text-zinc-900 dark:text-white">
                                {hotel.name}
                              </p>

                              <p className="mt-1 truncate text-xs text-zinc-500">
                                /{hotel.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <span className="rounded-lg bg-zinc-100 px-2.5 py-1 text-xs font-semibold dark:bg-white/5">
                            {hotel.propertyType.replaceAll(
                              "_",
                              " "
                            )}
                          </span>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-medium">
                            {hotel.location?.city || "-"}
                          </p>
                          <p className="mt-1 text-xs text-zinc-500">
                            {hotel.location?.district || ""}
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <p className="text-sm font-bold">
                            {formatCurrency(
                              hotel.priceFrom
                            )}
                          </p>

                          <p className="mt-1 text-xs text-zinc-500">
                            from / night
                          </p>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex flex-col gap-2">
                            <button
                              type="button"
                              disabled={
                                actionId === hotel._id
                              }
                              onClick={() =>
                                updateHotel(
                                  hotel._id,
                                  {
                                    isPublished:
                                      !hotel.isPublished,
                                  }
                                )
                              }
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                hotel.isPublished
                                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                                  : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-white/5"
                              }`}
                            >
                              {hotel.isPublished ? (
                                <CheckCircle2 className="h-3.5 w-3.5" />
                              ) : (
                                <XCircle className="h-3.5 w-3.5" />
                              )}
                              {hotel.isPublished
                                ? "Published"
                                : "Draft"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                actionId === hotel._id
                              }
                              onClick={() =>
                                updateHotel(
                                  hotel._id,
                                  {
                                    isVerified:
                                      !hotel.isVerified,
                                  }
                                )
                              }
                              className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                                hotel.isVerified
                                  ? "border-blue-500/20 bg-blue-500/10 text-blue-400"
                                  : "border-zinc-300 bg-zinc-100 text-zinc-500 dark:border-white/10 dark:bg-white/5"
                              }`}
                            >
                              <ShieldCheck className="h-3.5 w-3.5" />
                              {hotel.isVerified
                                ? "Verified"
                                : "Verify"}
                            </button>
                          </div>
                        </td>

                        <td className="px-5 py-5">
                          <div className="flex justify-end gap-2">
                            <Link
                              href={`/admin/hotels/${hotel._id}`}
                              className="rounded-xl border border-zinc-200 p-2.5 text-zinc-500 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] dark:border-white/10"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </Link>

                            <Link
                              href={`/admin/hotels/${hotel._id}?edit=true`}
                              className="rounded-xl border border-zinc-200 p-2.5 text-zinc-500 transition hover:border-[#D4AF37]/40 hover:text-[#D4AF37] dark:border-white/10"
                              title="Edit"
                            >
                              <Pencil className="h-4 w-4" />
                            </Link>

                            <button
                              type="button"
                              disabled={
                                actionId === hotel._id
                              }
                              onClick={() =>
                                deleteHotel(hotel)
                              }
                              className="rounded-xl border border-red-500/20 p-2.5 text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                              title="Delete"
                            >
                              {actionId === hotel._id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </button>
                          </div>

                          <p className="mt-2 text-right text-[11px] text-zinc-500">
                            {formatDate(hotel.createdAt)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* MOBILE */}
              <div className="divide-y divide-zinc-100 lg:hidden dark:divide-white/5">
                {hotels.map((hotel) => (
                  <div
                    key={hotel._id}
                    className="p-5"
                  >
                    <div className="flex gap-3">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-100 dark:bg-white/5">
                        {hotel.images?.[0] ? (
                          <img
                            src={hotel.images[0]}
                            alt={hotel.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-5 w-5 text-zinc-400" />
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold">
                          {hotel.name}
                        </h3>

                        <p className="mt-1 text-xs text-zinc-500">
                          {hotel.location?.city || "-"} ·{" "}
                          {hotel.propertyType.replaceAll(
                            "_",
                            " "
                          )}
                        </p>

                        <p className="mt-2 text-sm font-bold text-[#D4AF37]">
                          {formatCurrency(
                            hotel.priceFrom
                          )}{" "}
                          <span className="font-normal text-zinc-500">
                            / night
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        disabled={
                          actionId === hotel._id
                        }
                        onClick={() =>
                          updateHotel(
                            hotel._id,
                            {
                              isPublished:
                                !hotel.isPublished,
                            }
                          )
                        }
                        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold dark:border-white/10"
                      >
                        {hotel.isPublished
                          ? "Published"
                          : "Draft"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          actionId === hotel._id
                        }
                        onClick={() =>
                          updateHotel(
                            hotel._id,
                            {
                              isVerified:
                                !hotel.isVerified,
                            }
                          )
                        }
                        className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-semibold dark:border-white/10"
                      >
                        {hotel.isVerified
                          ? "Verified"
                          : "Verify"}
                      </button>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/admin/hotels/${hotel._id}`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold dark:border-white/10"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </Link>

                      <Link
                        href={`/admin/hotels/${hotel._id}?edit=true`}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold dark:border-white/10"
                      >
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Link>

                      <button
                        type="button"
                        onClick={() =>
                          deleteHotel(hotel)
                        }
                        disabled={
                          actionId === hotel._id
                        }
                        className="flex items-center justify-center rounded-xl border border-red-500/20 px-4 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* PAGINATION */}
          {pagination &&
            pagination.totalPages > 0 && (
              <div className="flex flex-col gap-3 border-t border-zinc-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
                <p className="text-xs text-zinc-500">
                  Page {pagination.page} of{" "}
                  {pagination.totalPages}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    disabled={
                      !pagination.hasPreviousPage
                    }
                    onClick={() =>
                      setPage((current) =>
                        Math.max(1, current - 1)
                      )
                    }
                    className="rounded-xl border border-zinc-200 p-2 disabled:opacity-40 dark:border-white/10"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    disabled={
                      !pagination.hasNextPage
                    }
                    onClick={() =>
                      setPage(
                        (current) => current + 1
                      )
                    }
                    className="rounded-xl border border-zinc-200 p-2 disabled:opacity-40 dark:border-white/10"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
        </section>
      </div>
    </div>
  );
}