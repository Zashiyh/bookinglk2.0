
"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleRegister(event: FormEvent) {
    event.preventDefault();

    setError("");

    if (!firstName || !lastName || !email || !password) {
      setError(
        "First name, last name, email and password are required."
      );
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Unable to create account."
        );
      }

      router.push("/login");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-[#080808] dark:text-white">
      {/* Navbar spacing */}
      <div className="pt-20 sm:pt-24">
        <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">
          {/* =====================================================
              LEFT VISUAL
          ====================================================== */}
          <div className="relative hidden min-h-[calc(100vh-5rem)] overflow-hidden lg:block">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=85')",
              }}
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/30 to-black" />

            {/* Gold glow */}
            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            {/* Content */}
            <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-end p-10 xl:p-16">
              <div className="max-w-xl text-white">
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5D76E]">
                  BookingLK
                </p>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight xl:text-6xl">
                  Start your journey.
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-white/65 xl:text-lg">
                  Create your BookingLK account and discover
                  hotels, resorts, villas and unique stays
                  across Sri Lanka.
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
                    Hotels
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
                    Resorts
                  </span>

                  <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
                    Villas
                  </span>

                  <span className="rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/10 px-4 py-2 text-xs text-[#F5D76E] backdrop-blur-md">
                    Sri Lanka
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* =====================================================
              FORM
          ====================================================== */}
          <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
            <div className="w-full max-w-md">
              {/* Header */}
              <div className="mb-8">
                <Link
                  href="/"
                  className="inline-flex text-sm font-semibold text-[#B8860B] transition hover:text-[#D4AF37] dark:text-[#F5D76E] dark:hover:text-[#FFE89A]"
                >
                  BookingLK
                </Link>

                <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                  Create your account
                </h2>

                <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  Join BookingLK and start exploring Sri Lanka.
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
                onSubmit={handleRegister}
                className="space-y-4"
              >
                {/* Names */}
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* First Name */}
                  <div>
                    <label
                      htmlFor="firstName"
                      className="text-sm font-medium"
                    >
                      First name
                    </label>

                    <div className="relative mt-2">
                      <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                      <input
                        id="firstName"
                        type="text"
                        autoComplete="given-name"
                        value={firstName}
                        onChange={(event) =>
                          setFirstName(event.target.value)
                        }
                        placeholder="John"
                        className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                      />
                    </div>
                  </div>

                  {/* Last Name */}
                  <div>
                    <label
                      htmlFor="lastName"
                      className="text-sm font-medium"
                    >
                      Last name
                    </label>

                    <input
                      id="lastName"
                      type="text"
                      autoComplete="family-name"
                      value={lastName}
                      onChange={(event) =>
                        setLastName(event.target.value)
                      }
                      placeholder="Doe"
                      className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="text-sm font-medium"
                  >
                    Email address
                  </label>

                  <div className="relative mt-2">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="you@example.com"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label
                    htmlFor="phone"
                    className="text-sm font-medium"
                  >
                    Phone number{" "}
                    <span className="text-zinc-400">
                      (optional)
                    </span>
                  </label>

                  <div className="relative mt-2">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(event) =>
                        setPhone(event.target.value)
                      }
                      placeholder="0771234567"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
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
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    <input
                      id="password"
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      value={password}
                      onChange={(event) =>
                        setPassword(event.target.value)
                      }
                      placeholder="Minimum 8 characters"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((value) => !value)
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

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="text-sm font-medium"
                  >
                    Confirm password
                  </label>

                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(
                          event.target.value
                        )
                      }
                      placeholder="Repeat your password"
                      className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (value) => !value
                        )
                      }
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 transition hover:text-zinc-700 dark:hover:text-white"
                      aria-label={
                        showConfirmPassword
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirmPassword ? (
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
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/10 transition hover:bg-[#F5D76E] hover:shadow-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {loading
                    ? "Creating account..."
                    : "Create account"}
                </button>
              </form>

              {/* Login */}
              <p className="mt-7 text-center text-sm text-zinc-500 dark:text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-[#B8860B] transition hover:text-[#D4AF37] dark:text-[#F5D76E] dark:hover:text-[#FFE89A]"
                >
                  Sign in
                </Link>
              </p>

              {/* Back */}
              <Link
                href="/"
                className="mt-5 flex justify-center text-xs text-zinc-400 transition hover:text-zinc-700 dark:hover:text-white"
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

