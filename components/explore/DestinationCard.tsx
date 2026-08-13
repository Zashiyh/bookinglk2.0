"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

type Props = {
  name: string;
  subtitle: string;
  image: string;
  onClick: () => void;
};

export default function DestinationCard({
  name,
  subtitle,
  image,
  onClick,
}: Props) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{
        y: -6,
      }}
      className="group relative aspect-[4/5] overflow-hidden rounded-[2rem] text-left"
    >
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h3 className="text-2xl font-black text-white">
              {name}
            </h3>

            <p className="mt-1 text-xs text-white/60">
              {subtitle}
            </p>
          </div>

          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-black transition group-hover:bg-[#D4AF37]">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </motion.button>
  );
}