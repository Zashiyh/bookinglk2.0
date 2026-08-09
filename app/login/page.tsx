
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Invalid email or password."
        );
      }

      router.push("/");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="grid min-h-screen lg:grid-cols-2">

        {/* =====================================================
            LEFT VISUAL
        ===================================================== */}
        <div className="relative hidden min-h-screen overflow-hidden lg:block">

          {/* Background */}
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=1800&q=85')",
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black/55" />

          {/* Cinematic gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/35 to-black" />

          {/* Gold glow */}
          <div className="absolute left-1/2 top-1/3 h-[450px] w-[450px] -translate-x-1/2 rounded-full bg-[#D4AF37]/10 blur-[140px]" />

          {/* Content */}
          <div className="relative z-10 flex min-h-screen items-end p-12 xl:p-16">
            <div className="max-w-xl text-white">

              <p className="text-xs font-bold uppercase tracking-[0.25em] text-[var(--gold-bright)]">
                BookingLK
              </p>

              <h1 className="mt-5 text-5xl font-extrabold tracking-tight xl:text-6xl">
                Welcome back.
              </h1>

              <p className="mt-5 max-w-lg text-base leading-7 text-white/65">
                Sign in to manage your bookings, discover
                beautiful stays and continue your journey
                across Sri Lanka.
              </p>

            </div>
          </div>
        </div>

        {/* =====================================================
            RIGHT LOGIN FORM
        ===================================================== */}
        <div className="relative flex min-h-screen items-center justify-center px-5 pb-12 pt-28 sm:px-8 sm:pt-32 lg:pt-28">

          {/* Mobile background glow */}
          <div className="pointer-events-none absolute left-1/2 top-20 h-72 w-72 -translate-x-1/2 rounded-full bg-[#D4AF37]/5 blur-[100px] lg:hidden" />

          <div className="relative z-10 w-full max-w-md">

            {/* Brand */}
            <div className="mb-10">

              <Link
                href="/"
                className="inline-flex text-sm font-semibold text-[var(--gold)] transition hover:text-[var(--gold-bright)]"
              >
                BookingLK
              </Link>

              <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                Enter your details to continue.
              </p>

            </div>

            {/* Error */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm leading-6 text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Form */}
            <form
              onSubmit={handleLogin}
              className="space-y-5"
            >

              {/* Email */}
              <div>

                <label
                  htmlFor="email"
                  className="text-sm font-medium"
                >
                  Email address
                </label>

                <div className="relative mt-2">

                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111]"
                  />

                </div>
              </div>

              {/* Password */}
              <div>

                <div className="flex items-center justify-between">

                  <label
                    htmlFor="password"
                    className="text-sm font-medium"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-[var(--gold)] transition hover:text-[var(--gold-bright)]"
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative mt-2">

                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700 dark:hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black shadow-[0_10px_30px_rgba(212,175,55,0.12)] transition hover:bg-[#F5D76E] hover:shadow-[0_12px_35px_rgba(212,175,55,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading
                  ? "Signing in..."
                  : "Sign in"}
              </button>

            </form>

            {/* Divider */}
            <div className="my-8 flex items-center gap-4">

              <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />

              <span className="text-xs text-zinc-400">
                OR
              </span>

              <div className="h-px flex-1 bg-zinc-200 dark:bg-white/10" />

            </div>

            {/* Register */}
            <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">

              Don't have an account?{" "}

              <Link
                href="/register"
                className="font-semibold text-[var(--gold)] transition hover:text-[var(--gold-bright)]"
              >
                Create account
              </Link>

            </p>

            {/* Back */}
            <Link
              href="/"
              className="mt-7 flex justify-center text-xs text-zinc-400 transition hover:text-zinc-700 dark:hover:text-white"
            >
              ← Back to BookingLK
            </Link>

          </div>
        </div>

      </div>
    </main>
  );
}

