"use client";

import Link from "next/link";
import { MapPin, ArrowRight, Tag } from "lucide-react";
import DealCountdown from "./DealCountdown";

export type PublicDeal = {
  _id: string;
  title: string;
  slug: string;
  description?: string;

  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;

  originalPrice: number;
  dealPrice: number;
  currency?: string;

  startDate: string;
  endDate: string;

  image?: string;

  isFeatured?: boolean;

  hotelId?: {
    _id?: string;
    name?: string;
    slug?: string;

    location?: {
      city?: string;
    };

    images?: string[];

    priceFrom?: number;
  };
};

type Props = {
  deal: PublicDeal;
};

export default function DealCard({ deal }: Props) {
  const hotelName =
    deal.hotelId?.name || "Sri Lankan Hotel";

  const city =
    deal.hotelId?.location?.city ||
    "Sri Lanka";

  const image =
    deal.image ||
    deal.hotelId?.images?.[0] ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80";

  const discount =
    deal.discountType === "PERCENTAGE"
      ? `${deal.discountValue}% OFF`
      : `LKR ${deal.discountValue.toLocaleString()} OFF`;

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#111] transition duration-300 hover:-translate-y-1 hover:border-yellow-400/30 hover:shadow-2xl hover:shadow-yellow-500/5">
      <div className="relative h-60 overflow-hidden">
        <img
          src={image}
          alt={deal.title}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1.5 text-xs font-black text-black">
          {discount}
        </div>

        {deal.isFeatured && (
          <div className="absolute right-4 top-4 rounded-full border border-white/20 bg-black/60 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
            Featured
          </div>
        )}

        <div className="absolute bottom-4 left-4 right-4">
          <p className="mb-1 text-xs font-medium text-yellow-300">
            {hotelName}
          </p>

          <div className="flex items-center gap-1 text-xs text-white/70">
            <MapPin size={13} />
            {city}
          </div>
        </div>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-1 text-lg font-bold text-white">
          {deal.title}
        </h3>

        {deal.description && (
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
            {deal.description}
          </p>
        )}

        <div className="mt-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-white/35">
              Special price
            </p>

            <div className="mt-1 flex items-center gap-2">
              <span className="text-xl font-black text-yellow-400">
                LKR {deal.dealPrice.toLocaleString()}
              </span>

              <span className="text-sm text-white/30 line-through">
                LKR {deal.originalPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <DealCountdown endDate={deal.endDate} />
        </div>

        <Link
          href={`/deals/${deal.slug}`}
          className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-black text-black transition hover:bg-yellow-300"
        >
          View Deal
          <ArrowRight size={16} />
        </Link>
      </div>
    </article>
  );
}