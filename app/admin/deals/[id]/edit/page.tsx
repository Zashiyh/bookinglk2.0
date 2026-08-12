"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import DealForm, {
  DealFormData,
} from "@/components/admin/deals/DealForm";

export default function EditDealPage() {
  const params = useParams();

  const id =
    typeof params.id === "string"
      ? params.id
      : "";

  const [data, setData] =
    useState<DealFormData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    if (!id) return;

    async function loadDeal() {
      try {
        setLoading(true);
        setError("");

        const response =
          await fetch(
            `/api/admin/deals/${id}`,
            {
              cache: "no-store",
            }
          );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message ||
              "Failed to load deal."
          );
        }

        const deal =
          result.deal;

        if (!deal) {
          throw new Error(
            "Deal not found."
          );
        }

        setData({
          hotelId:
            deal.hotelId?._id?.toString?.() ||
            deal.hotelId?.toString?.() ||
            "",

          title:
            deal.title ?? "",

          slug:
            deal.slug ?? "",

          description:
            deal.description ?? "",

          discountType:
            deal.discountType ===
            "FIXED"
              ? "FIXED"
              : "PERCENTAGE",

          discountValue:
            deal.discountValue != null
              ? String(
                  deal.discountValue
                )
              : "",

          originalPrice:
            deal.originalPrice != null
              ? String(
                  deal.originalPrice
                )
              : "",

          dealPrice:
            deal.dealPrice != null
              ? String(
                  deal.dealPrice
                )
              : "",

          startDate:
            deal.startDate
              ? formatDateTimeLocal(
                  deal.startDate
                )
              : "",

          endDate:
            deal.endDate
              ? formatDateTimeLocal(
                  deal.endDate
                )
              : "",

          maxBookings:
            deal.maxBookings != null
              ? String(
                  deal.maxBookings
                )
              : "",

          promoCode:
            deal.promoCode ?? "",

          image:
            deal.image ?? "",

          isFeatured:
            Boolean(
              deal.isFeatured
            ),

          isPublished:
            Boolean(
              deal.isPublished
            ),
        });
      } catch (err) {
        console.error(
          "LOAD DEAL ERROR:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Failed to load deal."
        );
      } finally {
        setLoading(false);
      }
    }

    loadDeal();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#080808] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">

          <div className="animate-pulse space-y-6">

            <div className="h-8 w-48 rounded-xl bg-white/10" />

            <div className="h-32 rounded-3xl bg-white/5" />

            <div className="h-72 rounded-3xl bg-white/5" />

            <div className="h-72 rounded-3xl bg-white/5" />

          </div>

        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#080808] px-4 text-white">

        <div className="w-full max-w-lg rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">

          <h1 className="text-xl font-bold">
            Unable to load deal
          </h1>

          <p className="mt-3 text-sm text-red-300">
            {error ||
              "Deal not found."}
          </p>

          <a
            href="/admin/deals"
            className="mt-6 inline-flex rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
          >
            Back to Deals
          </a>

        </div>

      </div>
    );
  }

  return (
    <DealForm
      mode="edit"
      dealId={id}
      initialData={data}
    />
  );
}

function formatDateTimeLocal(
  value: string | Date
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const offset =
    date.getTimezoneOffset();

  const localDate =
    new Date(
      date.getTime() -
        offset * 60 * 1000
    );

  return localDate
    .toISOString()
    .slice(0, 16);
}