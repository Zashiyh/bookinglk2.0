"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Navbar } from "@/components/navbar/navbar";

type Step = "EMAIL" | "OTP" | "SUCCESS";

export default function ChangeEmailPage() {
  const [step, setStep] = useState<Step>("EMAIL");

  const [newEmail, setNewEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | REQUEST EMAIL OTP
  |--------------------------------------------------------------------------
  */

  async function requestOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const email = newEmail.trim().toLowerCase();

    if (!email) {
      setError("Please enter your new email address.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/profile/security/email/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            newEmail: email,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Server returned an invalid response (${response.status}). Please check the API route.`
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to send verification code."
        );
      }

      setNewEmail(email);
      setOtp("");
      setStep("OTP");

      setSuccess(
        "A verification code has been sent to your new email address."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send verification code."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | VERIFY EMAIL OTP
  |--------------------------------------------------------------------------
  */

  async function verifyOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const cleanOtp = otp.replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/profile/security/email/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            newEmail: newEmail.trim().toLowerCase(),
            otp: cleanOtp,
          }),
        }
      );

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        throw new Error(
          `Server returned an invalid response (${response.status}). Please check the API route.`
        );
      }

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to verify email address."
        );
      }

      setOtp("");
      setStep("SUCCESS");

      setSuccess(
        "Your email address has been changed successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify email address."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | BACK TO EMAIL
  |--------------------------------------------------------------------------
  */

  function backToEmail() {
    if (loading) return;

    setStep("EMAIL");
    setOtp("");
    setError("");
    setSuccess("");
  }

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      <div className="mx-auto max-w-xl px-4 pb-20 pt-28 sm:px-6">
        <Link
          href="/profile/settings"
          className="mb-7 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Settings
        </Link>

        {/* Header */}

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.07]">
            <Mail className="h-5 w-5 text-[#D4AF37]" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Change Email
          </h1>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Verify your new email address before it is
            added to your BookingLK account.
          </p>
        </div>

        {/* Error */}

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {/* Success */}

        {success && step !== "SUCCESS" && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm leading-6 text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

            <span>{success}</span>
          </div>
        )}

        {/* ================================================================
            STEP 1 - EMAIL
        ================================================================= */}

        {step === "EMAIL" && (
          <form
            onSubmit={requestOtp}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-7 flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                <ShieldCheck className="h-4 w-4 text-white/60" />
              </div>

              <div>
                <h2 className="font-medium">
                  Verify new email
                </h2>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  Enter your new email address. We will
                  send a one-time verification code to
                  that email.
                </p>
              </div>
            </div>

            <label
              htmlFor="newEmail"
              className="mb-2 block text-sm font-medium text-white/70"
            >
              New Email Address
            </label>

            <input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(event) =>
                setNewEmail(event.target.value)
              }
              required
              autoComplete="email"
              placeholder="you@example.com"
              className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
            />

            <button
              type="submit"
              disabled={
                loading || !newEmail.trim()
              }
              className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#D4AF37] text-sm font-semibold text-black transition hover:bg-[#e5c04a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Verification Code
                </>
              )}
            </button>
          </form>
        )}

        {/* ================================================================
            STEP 2 - OTP
        ================================================================= */}

        {step === "OTP" && (
          <form
            onSubmit={verifyOtp}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#D4AF37]/10">
                <Mail className="h-6 w-6 text-[#D4AF37]" />
              </div>

              <h2 className="text-xl font-semibold">
                Verify your new email
              </h2>

              <p className="mt-2 text-sm text-white/40">
                Enter the 6-digit verification code
                sent to:
              </p>

              <p className="mt-1 break-all text-sm font-medium text-[#D4AF37]">
                {newEmail}
              </p>
            </div>

            <label
              htmlFor="otp"
              className="mb-2 block text-sm font-medium text-white/70"
            >
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={6}
              value={otp}
              onChange={(event) =>
                setOtp(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                )
              }
              required
              placeholder="000000"
              className="h-14 w-full rounded-xl border border-white/[0.09] bg-black/30 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
            />

            <button
              type="submit"
              disabled={
                loading || otp.length !== 6
              }
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-black transition hover:bg-[#e5c04a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify & Change Email"}
            </button>

            <button
              type="button"
              onClick={backToEmail}
              disabled={loading}
              className="mt-3 h-11 w-full rounded-xl border border-white/[0.08] text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
            >
              Use a different email
            </button>
          </form>
        )}

        {/* ================================================================
            STEP 3 - SUCCESS
        ================================================================= */}

        {step === "SUCCESS" && (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.05] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Email Changed
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Your BookingLK email address has been
              updated successfully.
            </p>

            <p className="mt-3 break-all text-sm font-medium text-[#D4AF37]">
              {newEmail}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/profile/settings"
                className="inline-flex h-11 items-center justify-center rounded-xl bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#e5c04a]"
              >
                Back to Settings
              </Link>

              <Link
                href="/profile"
                className="inline-flex h-11 items-center justify-center rounded-xl border border-white/[0.08] px-5 text-sm font-medium text-white/70 transition hover:bg-white/[0.04] hover:text-white"
              >
                View Profile
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}