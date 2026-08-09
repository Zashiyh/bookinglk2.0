"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        aria-label="Toggle theme"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={
        isDark
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      onClick={() =>
        setTheme(isDark ? "light" : "dark")
      }
      className="
        relative
        flex
        h-10
        w-10
        items-center
        justify-center
        rounded-full
        border
        border-zinc-200
        bg-white
        text-zinc-700
        shadow-sm
        transition-all
        duration-300
        hover:scale-105
        hover:bg-zinc-100
        dark:border-white/10
        dark:bg-white/5
        dark:text-white
        dark:hover:bg-white/10
      "
    >
      <Sun
        className={`
          absolute h-4 w-4
          transition-all duration-300
          ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }
        `}
      />

      <Moon
        className={`
          absolute h-4 w-4
          transition-all duration-300
          ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }
        `}
      />
    </button>
  );
}