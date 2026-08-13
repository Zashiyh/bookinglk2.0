"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, SlidersHorizontal } from "lucide-react";

export type SortOption =
  | "recommended"
  | "price-low"
  | "price-high"
  | "rating"
  | "newest";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

const options: {
  value: SortOption;
  label: string;
  description: string;
}[] = [
  {
    value: "recommended",
    label: "Recommended",
    description: "Best matches for you",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
    description: "Lowest nightly price first",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
    description: "Highest nightly price first",
  },
  {
    value: "rating",
    label: "Highest Rated",
    description: "Best guest ratings first",
  },
  {
    value: "newest",
    label: "Newest",
    description: "Recently added stays",
  },
];

export default function SortDropdown({
  value,
  onChange,
  className = "",
}: SortDropdownProps) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption =
    options.find((option) => option.value === value) ??
    options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div
      ref={dropdownRef}
      className={`relative ${className}`}
    >
      {/* Trigger */}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          group
          flex
          h-11
          w-full
          items-center
          justify-between
          gap-3
          rounded-2xl
          border
          border-black/10
          bg-white
          px-4
          text-left
          transition-all
          duration-200
          hover:border-[#D4AF37]/50
          hover:shadow-sm
          focus:outline-none
          focus:ring-2
          focus:ring-[#D4AF37]/20
          dark:border-white/10
          dark:bg-[#111111]
          ${
            open
              ? "border-[#D4AF37]/60 shadow-lg shadow-[#D4AF37]/5"
              : ""
          }
        `}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={`
              flex
              h-8
              w-8
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#D4AF37]/10
              text-[#B8860B]
              transition
              dark:text-[#F5D76E]
              ${
                open
                  ? "bg-[#D4AF37] text-black"
                  : ""
              }
            `}
          >
            <SlidersHorizontal className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-zinc-400">
              Sort by
            </p>

            <p className="truncate text-sm font-bold text-zinc-900 dark:text-white">
              {selectedOption.label}
            </p>
          </div>
        </div>

        <ChevronDown
          className={`
            h-4
            w-4
            shrink-0
            text-zinc-400
            transition-transform
            duration-200
            ${
              open
                ? "rotate-180 text-[#B8860B] dark:text-[#F5D76E]"
                : ""
            }
          `}
        />
      </button>

      {/* Dropdown */}

      {open && (
        <div
          role="listbox"
          aria-label="Sort options"
          className="
            absolute
            right-0
            z-50
            mt-2
            w-full
            min-w-[260px]
            overflow-hidden
            rounded-2xl
            border
            border-black/10
            bg-white
            p-1.5
            shadow-2xl
            shadow-black/10
            dark:border-white/10
            dark:bg-[#111111]
            dark:shadow-black/40
          "
        >
          <div className="px-3 pb-2 pt-2">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-400">
              Sort results
            </p>
          </div>

          <div className="space-y-0.5">
            {options.map((option) => {
              const isSelected = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() =>
                    handleSelect(option.value)
                  }
                  className={`
                    flex
                    w-full
                    items-center
                    justify-between
                    gap-3
                    rounded-xl
                    px-3
                    py-3
                    text-left
                    transition
                    ${
                      isSelected
                        ? "bg-[#D4AF37]/10"
                        : "hover:bg-zinc-100 dark:hover:bg-white/[0.05]"
                    }
                  `}
                >
                  <div className="min-w-0">
                    <p
                      className={`
                        text-sm
                        font-semibold
                        ${
                          isSelected
                            ? "text-[#9A7800] dark:text-[#F5D76E]"
                            : "text-zinc-800 dark:text-zinc-200"
                        }
                      `}
                    >
                      {option.label}
                    </p>

                    <p className="mt-0.5 truncate text-[11px] text-zinc-400">
                      {option.description}
                    </p>
                  </div>

                  <div
                    className={`
                      flex
                      h-7
                      w-7
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      ${
                        isSelected
                          ? "bg-[#D4AF37] text-black"
                          : "text-transparent"
                      }
                    `}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}