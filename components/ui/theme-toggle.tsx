"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-10 w-10 rounded-xl border border-[var(--border)]" />
    );
  }

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  return (
    <button
      type="button"
      aria-label="Change theme"
      onClick={() => {
        if (theme === "light") {
          setTheme("dark");
        } else if (theme === "dark") {
          setTheme("system");
        } else {
          setTheme("light");
        }
      }}
      className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--muted)] transition hover:border-[var(--gold)] hover:text-[var(--gold-bright)]"
    >
      {theme === "system" ? (
        <Monitor size={17} />
      ) : currentTheme === "dark" ? (
        <Moon size={17} />
      ) : (
        <Sun size={17} />
      )}
    </button>
  );
}