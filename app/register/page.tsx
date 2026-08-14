
"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  RefreshCw,
  ShieldCheck,
  User,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Step = "register" | "verify" | "success";

export default function RegisterPage() {
  const router = useRouter();

  // =========================================================
  // REGISTER FORM
  // =========================================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  // =========================================================
  // PASSWORD VISIBILITY
  // =========================================================

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  // =========================================================
  // VERIFICATION
  // =========================================================

  const [verificationCode, setVerificationCode] =
    useState("");

  const [step, setStep] =
    useState<Step>("register");

  const [verificationLoading, setVerificationLoading] =
    useState(false);

  const [resendLoading, setResendLoading] =
    useState(false);

  const [resendCountdown, setResendCountdown] =
    useState(0);

  // =========================================================
  // GENERAL STATE
  // =========================================================

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  // =========================================================
  // RESEND COUNTDOWN
  // =========================================================

  useEffect(() => {
    if (resendCountdown <= 0) {
      return;
    }

    const timer = window.setInterval(() => {
      setResendCountdown((current) =>
        current > 0 ? current - 1 : 0
      );
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, [resendCountdown]);

  // =========================================================
  // REGISTER
  // =========================================================

  async function handleRegister(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const cleanFirstName =
      firstName.trim();

    const cleanLastName =
      lastName.trim();

    const cleanEmail =
      email.trim().toLowerCase();

    const cleanPhone =
      phone.trim();

    // ---------------------------------------------------------
    // Required fields
    // ---------------------------------------------------------

    if (
      !cleanFirstName ||
      !cleanLastName ||
      !cleanEmail ||
      !password
    ) {
      setError(
        "First name, last name, email and password are required."
      );
      return;
    }

    // ---------------------------------------------------------
    // Name validation
    // ---------------------------------------------------------

    if (cleanFirstName.length < 2) {
      setError(
        "First name must be at least 2 characters."
      );
      return;
    }

    if (cleanLastName.length < 2) {
      setError(
        "Last name must be at least 2 characters."
      );
      return;
    }

    // ---------------------------------------------------------
    // Email validation
    // ---------------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      setError(
        "Please enter a valid email address."
      );
      return;
    }

    // ---------------------------------------------------------
    // Password validation
    // ---------------------------------------------------------

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              firstName:
                cleanFirstName,

              lastName:
                cleanLastName,

              email:
                cleanEmail,

              phone:
                cleanPhone,

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
            "Unable to start registration."
        );
      }

      // -------------------------------------------------------
      // OTP has been sent
      // -------------------------------------------------------

      setEmail(cleanEmail);

      setVerificationCode("");

      setResendCountdown(60);

      setStep("verify");

      setSuccessMessage(
        result.message ||
          "A verification code has been sent to your email."
      );
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

  // =========================================================
  // VERIFY EMAIL
  // =========================================================

  async function handleVerifyEmail(
    event: FormEvent
  ) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const cleanCode =
      verificationCode
        .replace(/\D/g, "")
        .slice(0, 6);

    if (cleanCode.length !== 6) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    try {
      setVerificationLoading(true);

      const response =
        await fetch(
          "/api/auth/verify-email",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              firstName:
                firstName.trim(),

              lastName:
                lastName.trim(),

              email:
                email.trim().toLowerCase(),

              phone:
                phone.trim(),

              password,

              code: cleanCode,
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
            "Unable to verify your email."
        );
      }

      // -------------------------------------------------------
      // Account successfully created
      // -------------------------------------------------------

      setSuccessMessage(
        result.message ||
          "Email verified successfully. Your BookingLK account has been created."
      );

      setStep("success");

      // Redirect after short delay
      window.setTimeout(() => {
        router.push("/login");
      }, 2500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to verify your email."
      );
    } finally {
      setVerificationLoading(false);
    }
  }

  // =========================================================
  // RESEND VERIFICATION CODE
  // =========================================================

  async function handleResendCode() {
    if (resendCountdown > 0) {
      return;
    }

    setError("");
    setSuccessMessage("");

    try {
      setResendLoading(true);

      /*
       * Uses the same register endpoint.
       *
       * Your backend should detect an existing
       * unverified registration and send a new OTP
       * instead of creating another user.
       */

      const response =
        await fetch(
          "/api/auth/register",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              firstName:
                firstName.trim(),

              lastName:
                lastName.trim(),

              email:
                email.trim().toLowerCase(),

              phone:
                phone.trim(),

              password,
              resend: true,
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
            "Unable to resend verification code."
        );
      }

      setVerificationCode("");

      setResendCountdown(60);

      setSuccessMessage(
        result.message ||
          "A new verification code has been sent to your email."
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to resend verification code."
      );
    } finally {
      setResendLoading(false);
    }
  }

  // =========================================================
  // CHANGE EMAIL / BACK
  // =========================================================

  function handleBackToRegister() {
    setError("");
    setSuccessMessage("");
    setVerificationCode("");
    setStep("register");
  }

  // =========================================================
  // SUCCESS SCREEN
  // =========================================================

  if (step === "success") {
    return (
      <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-[#080808] dark:text-white">
        <div className="pt-20 sm:pt-24">
          <div className="grid min-h-[calc(100vh-5rem)] lg:grid-cols-2">

            {/* LEFT VISUAL */}
            <div className="relative hidden min-h-[calc(100vh-5rem)] overflow-hidden lg:block">
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1800&q=85')",
                }}
              />

              <div className="absolute inset-0 bg-black/50" />

              <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/30 to-black" />

              <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

              <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

              <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-end p-10 xl:p-16">
                <div className="max-w-xl text-white">
                  <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5D76E]">
                    BookingLK
                  </p>

                  <h1 className="mt-5 text-4xl font-extrabold tracking-tight xl:text-6xl">
                    Welcome to BookingLK.
                  </h1>

                  <p className="mt-5 max-w-lg text-base leading-7 text-white/65 xl:text-lg">
                    Your account is ready.
                    Start discovering amazing
                    stays across Sri Lanka.
                  </p>
                </div>
              </div>
            </div>

            {/* SUCCESS */}
            <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
              <div className="w-full max-w-md text-center">

                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#D4AF37]/10">
                  <CheckCircle2 className="h-10 w-10 text-[#D4AF37]" />
                </div>

                <h2 className="mt-7 text-3xl font-bold tracking-tight sm:text-4xl">
                  Account created!
                </h2>

                <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                  {successMessage ||
                    "Your BookingLK account has been successfully created."}
                </p>

                <div className="mt-8 flex items-center justify-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Redirecting to login...
                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push("/login")
                  }
                  className="mt-7 w-full rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black transition hover:bg-[#F5D76E]"
                >
                  Continue to login
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-950 dark:bg-[#080808] dark:text-white">
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

            <div className="absolute inset-0 bg-black/50" />

            <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/30 to-black" />

            <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div className="absolute bottom-20 right-0 h-80 w-80 rounded-full bg-[#D4AF37]/10 blur-3xl" />

            <div className="relative z-10 flex min-h-[calc(100vh-5rem)] items-end p-10 xl:p-16">
              <div className="max-w-xl text-white">

                <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#F5D76E]">
                  BookingLK
                </p>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight xl:text-6xl">
                  {step === "verify"
                    ? "Almost there."
                    : "Start your journey."}
                </h1>

                <p className="mt-5 max-w-lg text-base leading-7 text-white/65 xl:text-lg">
                  {step === "verify"
                    ? "Verify your email address to securely create your BookingLK account."
                    : "Create your BookingLK account and discover hotels, resorts, villas and unique stays across Sri Lanka."}
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
              RIGHT CONTENT
          ====================================================== */}

          <div className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-12 xl:px-20">
            <div className="w-full max-w-md">

              {/* =================================================
                  REGISTER STEP
              ================================================= */}

              {step === "register" && (
                <>
                  {/* HEADER */}

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

                  {/* ERROR */}

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm leading-6 text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {/* FORM */}

                  <form
                    onSubmit={handleRegister}
                    className="space-y-4"
                  >

                    {/* NAMES */}

                    <div className="grid gap-4 sm:grid-cols-2">

                      {/* FIRST NAME */}

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
                              setFirstName(
                                event.target.value
                              )
                            }
                            placeholder="John"
                            disabled={loading}
                            className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                          />

                        </div>
                      </div>

                      {/* LAST NAME */}

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
                            setLastName(
                              event.target.value
                            )
                          }
                          placeholder="Doe"
                          disabled={loading}
                          className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                        />

                      </div>
                    </div>

                    {/* EMAIL */}

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
                            setEmail(
                              event.target.value
                            )
                          }
                          placeholder="you@example.com"
                          disabled={loading}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                        />

                      </div>
                    </div>

                    {/* PHONE */}

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
                            setPhone(
                              event.target.value
                            )
                          }
                          placeholder="0771234567"
                          disabled={loading}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                        />

                      </div>
                    </div>

                    {/* PASSWORD */}

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
                            setPassword(
                              event.target.value
                            )
                          }
                          placeholder="Minimum 8 characters"
                          disabled={loading}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowPassword(
                              (value) =>
                                !value
                            )
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

                    {/* CONFIRM PASSWORD */}

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
                          disabled={loading}
                          className="w-full rounded-2xl border border-zinc-200 bg-white px-11 py-3.5 pr-12 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111111] dark:focus:border-[#D4AF37]"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(
                              (value) =>
                                !value
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

                    {/* SUBMIT */}

                    <button
                      type="submit"
                      disabled={loading}
                      className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/10 transition hover:bg-[#F5D76E] hover:shadow-[#D4AF37]/20 disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {loading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}

                      {loading
                        ? "Sending verification code..."
                        : "Create account"}

                    </button>
                  </form>

                  {/* LOGIN */}

                  <p className="mt-7 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Already have an account?{" "}

                    <Link
                      href="/login"
                      className="font-semibold text-[#B8860B] transition hover:text-[#D4AF37] dark:text-[#F5D76E] dark:hover:text-[#FFE89A]"
                    >
                      Sign in
                    </Link>
                  </p>

                  {/* BACK */}

                  <Link
                    href="/"
                    className="mt-5 flex justify-center text-xs text-zinc-400 transition hover:text-zinc-700 dark:hover:text-white"
                  >
                    ← Back to BookingLK
                  </Link>
                </>
              )}

              {/* =================================================
                  VERIFY STEP
              ================================================= */}

              {step === "verify" && (
                <>
                  {/* HEADER */}

                  <div className="mb-8">

                    <button
                      type="button"
                      onClick={
                        handleBackToRegister
                      }
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#B8860B] transition hover:text-[#D4AF37] dark:text-[#F5D76E]"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back
                    </button>

                    <div className="mt-7 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#D4AF37]/10">
                      <ShieldCheck className="h-7 w-7 text-[#D4AF37]" />
                    </div>

                    <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">
                      Verify your email
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
                      We sent a 6-digit verification
                      code to
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-zinc-900 dark:text-white">
                      {email}
                    </p>
                  </div>

                  {/* SUCCESS MESSAGE */}

                  {successMessage && (
                    <div className="mb-5 rounded-2xl border border-[#D4AF37]/20 bg-[#D4AF37]/5 px-4 py-3 text-sm leading-6 text-[#8A6A00] dark:text-[#F5D76E]">
                      {successMessage}
                    </div>
                  )}

                  {/* ERROR */}

                  {error && (
                    <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm leading-6 text-red-600 dark:text-red-400">
                      {error}
                    </div>
                  )}

                  {/* VERIFY FORM */}

                  <form
                    onSubmit={
                      handleVerifyEmail
                    }
                    className="space-y-5"
                  >

                    {/* CODE */}

                    <div>

                      <label
                        htmlFor="verificationCode"
                        className="text-sm font-medium"
                      >
                        Verification code
                      </label>

                      <input
                        id="verificationCode"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(event) => {
                          const value =
                            event.target.value
                              .replace(
                                /\D/g,
                                ""
                              )
                              .slice(
                                0,
                                6
                              );

                          setVerificationCode(
                            value
                          );
                        }}
                        placeholder="000000"
                        autoFocus
                        disabled={
                          verificationLoading
                        }
                        className="mt-2 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-4 text-center text-2xl font-bold tracking-[0.5em] outline-none transition placeholder:text-zinc-300 focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/10 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-[#111111] dark:placeholder:text-zinc-700 dark:focus:border-[#D4AF37]"
                      />

                      <p className="mt-2 text-xs text-zinc-400">
                        Enter the 6-digit code
                        from your Gmail inbox.
                      </p>
                    </div>

                    {/* VERIFY BUTTON */}

                    <button
                      type="submit"
                      disabled={
                        verificationLoading ||
                        verificationCode.length !==
                          6
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#D4AF37] py-3.5 text-sm font-bold text-black shadow-lg shadow-[#D4AF37]/10 transition hover:bg-[#F5D76E] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                      {verificationLoading && (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      )}

                      {verificationLoading
                        ? "Verifying..."
                        : "Verify email & create account"}

                    </button>
                  </form>

                  {/* RESEND */}

                  <div className="mt-7 text-center">

                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                      Didn't receive the
                      code?
                    </p>

                    <button
                      type="button"
                      onClick={
                        handleResendCode
                      }
                      disabled={
                        resendLoading ||
                        resendCountdown > 0
                      }
                      className="mt-2 inline-flex items-center gap-2 text-sm font-semibold text-[#B8860B] transition hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-50 dark:text-[#F5D76E]"
                    >

                      {resendLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : resendCountdown >
                        0 ? (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Resend code in{" "}
                          {resendCountdown}s
                        </>
                      ) : (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Resend verification code
                        </>
                      )}

                    </button>
                  </div>

                  {/* LOGIN */}

                  <p className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
                    Already verified?{" "}

                    <Link
                      href="/login"
                      className="font-semibold text-[#B8860B] transition hover:text-[#D4AF37] dark:text-[#F5D76E]"
                    >
                      Sign in
                    </Link>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

