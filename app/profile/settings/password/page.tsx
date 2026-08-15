"use client";

import {
  ArrowLeft,
  CheckCircle2,
  KeyRound,
  Mail,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { FormEvent, useState } from "react";

import { Navbar } from "@/components/navbar/navbar";

type Step =
  | "PASSWORD"
  | "OTP"
  | "NEW_PASSWORD"
  | "SUCCESS";

async function parseApiResponse(response: Response) {
  const contentType =
    response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    throw new Error(
      `Server returned an invalid response (${response.status}). Please check the API route.`
    );
  }

  return response.json();
}

export default function ChangePasswordPage() {
  const [step, setStep] =
    useState<Step>("PASSWORD");

  const [currentPassword, setCurrentPassword] =
    useState("");

  const [otp, setOtp] = useState("");

  const [newPassword, setNewPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /*
  |--------------------------------------------------------------------------
  | REQUEST OTP
  |--------------------------------------------------------------------------
  */

  async function requestOtp(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const password = currentPassword.trim();

    if (!password) {
      setError(
        "Please enter your current password."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "/api/profile/security/password/request-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            currentPassword: password,
          }),
        }
      );

      const result =
        await parseApiResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to send verification code."
        );
      }

      setOtp("");

      setStep("OTP");

      setSuccess(
        "A verification code has been sent to your registered email."
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
  | VERIFY OTP
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
        "/api/profile/security/password/verify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            otp: cleanOtp,
          }),
        }
      );

      const result =
        await parseApiResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Invalid verification code."
        );
      }

      /*
       * OTP verified successfully.
       *
       * The backend should now mark the
       * CHANGE_PASSWORD SecurityOTP as verified.
       */

      setStep("NEW_PASSWORD");

      setSuccess(
        "Email verification successful. Create your new password."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to verify code."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | CHANGE PASSWORD
  |--------------------------------------------------------------------------
  */

  async function changePassword(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const password = newPassword;
    const confirmation = confirmPassword;

    setError("");
    setSuccess("");

    if (password.length < 8) {
      setError(
        "New password must contain at least 8 characters."
      );
      return;
    }

    if (confirmation.length < 8) {
      setError(
        "Confirm password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmation) {
      setError(
        "New passwords do not match."
      );
      return;
    }

    if (password === currentPassword) {
      setError(
        "New password must be different from your current password."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "/api/profile/security/password/change",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          cache: "no-store",
          body: JSON.stringify({
            newPassword: password,
            confirmPassword: confirmation,
          }),
        }
      );

      const result =
        await parseApiResponse(response);

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to change password."
        );
      }

      setCurrentPassword("");
      setOtp("");
      setNewPassword("");
      setConfirmPassword("");

      setStep("SUCCESS");

      setSuccess(
        "Your password has been changed successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to change password."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | BACK TO PASSWORD
  |--------------------------------------------------------------------------
  */

  function backToPassword() {
    setStep("PASSWORD");

    setOtp("");

    setError("");

    setSuccess("");
  }

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

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

        <div className="mb-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[#D4AF37]/15 bg-[#D4AF37]/[0.07]">
            <KeyRound className="h-5 w-5 text-[#D4AF37]" />
          </div>

          <h1 className="text-3xl font-semibold tracking-tight">
            Change Password
          </h1>

          <p className="mt-2 text-sm leading-6 text-white/40">
            Verify your identity before changing
            your BookingLK password.
          </p>
        </div>

        {error && (
          <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3 text-sm leading-6 text-red-300">
            {error}
          </div>
        )}

        {success && step !== "SUCCESS" && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06] px-4 py-3 text-sm leading-6 text-emerald-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* ============================================================
            STEP 1 — CURRENT PASSWORD
        ============================================================ */}

        {step === "PASSWORD" && (
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
                  Verify your account
                </h2>

                <p className="mt-1 text-xs leading-5 text-white/35">
                  Enter your current password.
                  We will send a verification
                  code to your registered email.
                </p>
              </div>
            </div>

            <label
              htmlFor="currentPassword"
              className="mb-2 block text-sm font-medium text-white/70"
            >
              Current Password
            </label>

            <input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(event) => {
                setCurrentPassword(
                  event.target.value
                );
                setError("");
              }}
              required
              autoComplete="current-password"
              placeholder="Enter current password"
              className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
            />

            <button
              type="submit"
              disabled={
                loading ||
                !currentPassword.trim()
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

        {/* ============================================================
            STEP 2 — OTP
        ============================================================ */}

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
                Check your email
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Enter the 6-digit verification
                code sent to your registered
                email address.
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
              onChange={(event) => {
                setOtp(
                  event.target.value.replace(
                    /\D/g,
                    ""
                  )
                );
                setError("");
              }}
              required
              placeholder="000000"
              className="h-14 w-full rounded-xl border border-white/[0.09] bg-black/30 text-center text-2xl font-semibold tracking-[0.5em] text-white outline-none transition placeholder:text-white/15 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
            />

            <button
              type="submit"
              disabled={
                loading ||
                otp.length !== 6
              }
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-black transition hover:bg-[#e5c04a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Verifying..."
                : "Verify Code"}
            </button>

            <button
              type="button"
              onClick={backToPassword}
              disabled={loading}
              className="mt-3 h-11 w-full rounded-xl border border-white/[0.08] text-sm text-white/50 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
            >
              Use a different password
            </button>
          </form>
        )}

        {/* ============================================================
            STEP 3 — NEW PASSWORD
        ============================================================ */}

        {step === "NEW_PASSWORD" && (
          <form
            onSubmit={changePassword}
            className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8"
          >
            <div className="mb-7">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
              </div>

              <h2 className="text-xl font-semibold">
                Create new password
              </h2>

              <p className="mt-2 text-sm leading-6 text-white/40">
                Your identity has been verified.
                Create a strong new password with
                at least 8 characters.
              </p>
            </div>

            <div>
              <label
                htmlFor="newPassword"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                New Password
              </label>

              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(event) => {
                  setNewPassword(
                    event.target.value
                  );
                  setError("");
                }}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Enter new password"
                className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
              />

              <p className="mt-2 text-xs text-white/25">
                {newPassword.length}/8 minimum
                characters
              </p>
            </div>

            <div className="mt-5">
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-medium text-white/70"
              >
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value
                  );
                  setError("");
                }}
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Confirm new password"
                className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
              />

              {confirmPassword.length > 0 &&
                confirmPassword === newPassword && (
                  <p className="mt-2 text-xs text-emerald-400">
                    Passwords match.
                  </p>
                )}
            </div>

            <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3">
              <p className="text-xs leading-5 text-white/35">
                Password must be at least 8
                characters long. Use a mixture of
                letters, numbers and symbols for
                better security.
              </p>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                newPassword.length < 8 ||
                confirmPassword.length < 8 ||
                newPassword !== confirmPassword
              }
              className="mt-6 flex h-12 w-full items-center justify-center rounded-xl bg-[#D4AF37] text-sm font-semibold text-black transition hover:bg-[#e5c04a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Updating Password..."
                : "Change Password"}
            </button>
          </form>
        )}

        {/* ============================================================
            STEP 4 — SUCCESS
        ============================================================ */}

        {step === "SUCCESS" && (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/[0.05] p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>

            <h2 className="mt-5 text-xl font-semibold">
              Password Changed
            </h2>

            <p className="mt-2 text-sm leading-6 text-white/40">
              Your BookingLK password has been
              updated successfully.
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