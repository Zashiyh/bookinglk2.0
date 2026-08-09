"use client";

import {
  CalendarDays,
  MapPin,
  Search,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export function HotelSearch() {
  const router = useRouter();

  const goToHotels = () => {
    router.push("/hotels");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5,
      }}
      className="mx-auto mt-10 w-full max-w-6xl"
    >
      <div
        className="
          grid
          overflow-hidden
          rounded-[2rem]
          border
          border-white/10
          bg-black/30
          p-2
          shadow-2xl
          backdrop-blur-2xl
          lg:grid-cols-[1.5fr_1fr_1fr_1fr_auto]
        "
      >
        {/* Destination */}
        <button
          type="button"
          onClick={goToHotels}
          className="
            flex
            min-h-[72px]
            items-center
            gap-4
            rounded-2xl
            px-5
            text-left
            transition
            hover:bg-white/5
          "
        >
          <MapPin
            size={20}
            className="shrink-0 text-[var(--gold-bright)]"
          />

          <div>
            <p className="text-xs font-medium text-white/50">
              Where are you going?
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Search destinations
            </p>
          </div>
        </button>

        {/* Check in */}
        <button
          type="button"
          onClick={goToHotels}
          className="
            flex
            min-h-[72px]
            items-center
            gap-4
            rounded-2xl
            px-5
            text-left
            transition
            hover:bg-white/5
          "
        >
          <CalendarDays
            size={20}
            className="shrink-0 text-[var(--gold-bright)]"
          />

          <div>
            <p className="text-xs text-white/50">
              Check-in
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Add date
            </p>
          </div>
        </button>

        {/* Check out */}
        <button
          type="button"
          onClick={goToHotels}
          className="
            flex
            min-h-[72px]
            items-center
            gap-4
            rounded-2xl
            px-5
            text-left
            transition
            hover:bg-white/5
          "
        >
          <CalendarDays
            size={20}
            className="shrink-0 text-[var(--gold-bright)]"
          />

          <div>
            <p className="text-xs text-white/50">
              Check-out
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              Add date
            </p>
          </div>
        </button>

        {/* Guests */}
        <button
          type="button"
          onClick={goToHotels}
          className="
            flex
            min-h-[72px]
            items-center
            gap-4
            rounded-2xl
            px-5
            text-left
            transition
            hover:bg-white/5
          "
        >
          <Users
            size={20}
            className="shrink-0 text-[var(--gold-bright)]"
          />

          <div>
            <p className="text-xs text-white/50">
              Guests
            </p>

            <p className="mt-1 text-sm font-semibold text-white">
              2 Guests
            </p>
          </div>
        </button>

        {/* Search */}
        <button
          type="button"
          onClick={goToHotels}
          className="
            flex
            min-h-[72px]
            items-center
            justify-center
            gap-2
            rounded-2xl
            bg-[var(--gold)]
            px-7
            font-bold
            text-black
            transition
            hover:bg-[var(--gold-bright)]
            hover:shadow-[0_0_30px_rgba(212,175,55,0.2)]
            active:scale-[0.98]
          "
        >
          <Search size={19} />

          <span className="lg:hidden">
            Search stays
          </span>
        </button>
      </div>
    </motion.div>
  );
}