import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  MapPin,
  Percent,
  Tag,
} from "lucide-react";

import { Navbar } from "@/components/navbar/navbar";
import { Footer } from "@/components/footer/footer";
import { connectDB } from "@/lib/db/mongoose";
import { Deal } from "@/models/Deal";

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function DealDetailsPage({
  params,
}: PageProps) {
  const { id } = await params;

  await connectDB();

  const query = id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: id }
    : { slug: id };

  const deal = await Deal.findOne({
    ...query,
    isPublished: true,
  })
    .populate(
      "hotelId",
      "name slug location images rating"
    )
    .lean();

  if (!deal) {
    notFound();
  }

  const hotel = deal.hotelId as any;

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-[#050505] dark:text-white">
      <Navbar />

      <section className="pt-28">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <Link
            href="/deals"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-[#B8860B] dark:text-zinc-400 dark:hover:text-[#F5D76E]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to deals
          </Link>

          <div className="mt-8 overflow-hidden rounded-[2rem] border border-zinc-200 bg-white dark:border-white/10 dark:bg-[#111]">
            {/* IMAGE */}
            <div className="relative h-[320px] sm:h-[450px]">
              {deal.image ? (
                <img
                  src={deal.image}
                  alt={deal.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-gradient-to-br from-[#D4AF37]/20 to-zinc-900">
                  <Tag className="h-16 w-16 text-[#D4AF37]" />
                </div>
              )}

              <div className="absolute left-6 top-6 rounded-full bg-[#D4AF37] px-4 py-2 font-bold text-black">
                <span className="inline-flex items-center gap-2">
                  <Percent className="h-4 w-4" />

                  {deal.discountType === "PERCENTAGE"
                    ? `${deal.discountValue}% OFF`
                    : `LKR ${deal.discountValue.toLocaleString()} OFF`}
                </span>
              </div>
            </div>

            {/* CONTENT */}
            <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1fr_340px]">
              <div>
                {hotel?.name && (
                  <p className="text-sm font-semibold uppercase tracking-wider text-[#B8860B] dark:text-[#F5D76E]">
                    {hotel.name}
                  </p>
                )}

                <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-5xl">
                  {deal.title}
                </h1>

                <p className="mt-6 leading-8 text-zinc-500 dark:text-zinc-400">
                  {deal.description}
                </p>

                {hotel?.location?.city && (
                  <div className="mt-6 flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-4 w-4 text-[#D4AF37]" />
                    {hotel.location.city}
                  </div>
                )}

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {[
                    "Exclusive BookingLK deal",
                    "Secure online booking",
                    "Limited availability",
                    "Best available deal price",
                  ].map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 rounded-2xl border border-zinc-200 p-4 dark:border-white/10"
                    >
                      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D4AF37]/10">
                        <Check className="h-4 w-4 text-[#D4AF37]" />
                      </span>

                      <span className="text-sm">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* DEAL CARD */}
              <aside className="h-fit rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-white/10 dark:bg-white/5">
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Special deal price
                </p>

                <div className="mt-2">
                  <span className="text-3xl font-bold">
                    LKR{" "}
                    {deal.dealPrice.toLocaleString()}
                  </span>

                  <span className="ml-2 text-sm text-zinc-400 line-through">
                    LKR{" "}
                    {deal.originalPrice.toLocaleString()}
                  </span>
                </div>

                {deal.promoCode && (
                  <div className="mt-6 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 p-4">
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Promo code
                    </p>

                    <p className="mt-1 font-bold tracking-widest text-[#B8860B] dark:text-[#F5D76E]">
                      {deal.promoCode}
                    </p>
                  </div>
                )}

                <div className="mt-6 space-y-3 border-t border-zinc-200 pt-5 text-sm dark:border-white/10">
                  <div className="flex items-center gap-3">
                    <CalendarDays className="h-4 w-4 text-[#D4AF37]" />

                    <span>
                      Valid until{" "}
                      {new Date(
                        deal.endDate
                      ).toLocaleDateString("en-LK")}
                    </span>
                  </div>
                </div>

                {hotel?.slug && (
                  <Link
                    href={`/hotels/${hotel.slug}`}
                    className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#D4AF37] px-5 py-3.5 font-semibold text-black transition hover:bg-[#F5D76E]"
                  >
                    View hotel
                  </Link>
                )}
              </aside>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}