"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleLogin(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError(
        "Email and password are required."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
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
            "Unable to login."
        );
      }

      router.replace("/admin");
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
    <main className="min-h-screen bg-[#050505] text-white">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Visual */}
        <div className="relative hidden overflow-hidden lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=85')",
            }}
          />

          <div className="absolute inset-0 bg-black/60" />

          <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/30 to-black" />

          <div className="relative z-10 flex min-h-screen flex-col justify-between p-12">
            <Link
              href="/"
              className="text-xl font-extrabold"
            >
              Booking
              <span className="text-[#D4AF37]">
                LK
              </span>
            </Link>

            <div className="max-w-xl">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/15">
                <ShieldCheck className="h-7 w-7 text-[#D4AF37]" />
              </div>

              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5D76E]">
                BookingLK Control Center
              </p>

              <h1 className="mt-5 text-5xl font-extrabold tracking-tight">
                Manage the entire platform.
              </h1>

              <p className="mt-5 text-base leading-7 text-white/60">
                Manage hotels, rooms, bookings,
                users and the BookingLK
                marketplace from one secure
                administration panel.
              </p>
            </div>

            <p className="text-xs text-white/30">
              BookingLK Administration
            </p>
          </div>
        </div>

        {/* Login */}
        <div className="flex min-h-screen items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            <div className="mb-10">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <ShieldCheck className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
                    Secure access
                  </p>

                  <p className="text-sm text-zinc-500">
                    Administrator portal
                  </p>
                </div>
              </div>

              <h2 className="mt-8 text-3xl font-bold tracking-tight">
                Admin sign in
              </h2>

              <p className="mt-2 text-sm text-zinc-500">
                Sign in with your BookingLK
                administrator account.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

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
                  Admin email
                </label>

                <div className="relative mt-2">
                  <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="admin@example.com"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-600 focus:border-[#D4AF37] focus:bg-white/[0.07]"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium"
                >
                  Password
                </label>

                <div className="relative mt-2">
                  <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

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
                      setPassword(
                        event.target.value
                      )
                    }
                    placeholder="Enter your password"
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-600 focus:border-[#D4AF37] focus:bg-white/[0.07]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black transition hover:bg-[#F5D76E] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}

                {loading
                  ? "Authenticating..."
                  : "Sign in to admin"}
              </button>
            </form>

            <div className="mt-8 border-t border-white/10 pt-6 text-center">
              <Link
                href="/"
                className="text-xs text-zinc-500 transition hover:text-white"
              >
                ← Back to BookingLK
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}