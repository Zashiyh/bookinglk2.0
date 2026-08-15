"use client";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ChevronRight,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Trash2,
  Upload,
  User as UserIcon,
} from "lucide-react";
import Link from "next/link";
import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from "react";

import { Navbar } from "@/components/navbar/navbar";

interface Profile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  avatar: string | null;
  isEmailVerified: boolean;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  /*
  |--------------------------------------------------------------------------
  | LOAD PROFILE
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch("/api/profile", {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message || "Unable to load profile."
          );
        }

        const data = result.data as Profile;

        setProfile(data);
        setFirstName(data.firstName || "");
        setLastName(data.lastName || "");
        setPhone(data.phone || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | OPEN FILE PICKER
  |--------------------------------------------------------------------------
  */

  function openAvatarPicker() {
    if (uploadingAvatar || removingAvatar) {
      return;
    }

    fileInputRef.current?.click();
  }

  /*
  |--------------------------------------------------------------------------
  | AVATAR CHANGE
  |--------------------------------------------------------------------------
  */

  async function handleAvatarChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    // Reset input so selecting the same image again works
    event.target.value = "";

    if (!file) {
      return;
    }

    setError("");
    setSuccess("");

    /*
     * Client-side validation
     */

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG and WebP images are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.");
      return;
    }

    try {
      setUploadingAvatar(true);

      const formData = new FormData();

      formData.append("avatar", file);

      const response = await fetch("/api/profile/avatar", {
        method: "PUT",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to update profile picture."
        );
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              avatar: result.data.avatar,
            }
          : current
      );

      setSuccess(
        "Profile picture updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update profile picture."
      );
    } finally {
      setUploadingAvatar(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | REMOVE AVATAR
  |--------------------------------------------------------------------------
  */

  async function handleRemoveAvatar() {
    if (!profile?.avatar) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );

    if (!confirmed) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setRemovingAvatar(true);

      const response = await fetch(
        "/api/profile/avatar",
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to remove profile picture."
        );
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              avatar: null,
            }
          : current
      );

      setSuccess(
        "Profile picture removed successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to remove profile picture."
      );
    } finally {
      setRemovingAvatar(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | SAVE PROFILE
  |--------------------------------------------------------------------------
  */

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          firstName,
          lastName,
          phone,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to update profile."
        );
      }

      setProfile((current) =>
        current
          ? {
              ...current,
              firstName: result.data.firstName,
              lastName: result.data.lastName,
              phone: result.data.phone,
            }
          : current
      );

      setSuccess(
        "Your profile has been updated successfully."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  |--------------------------------------------------------------------------
  | LOADING
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#070707] text-white">
        <Navbar />

        <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-6">
          <div className="text-center">
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-white/10 border-t-[#D4AF37]" />

            <p className="text-sm text-white/50">
              Loading your profile...
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | PROFILE ERROR
  |--------------------------------------------------------------------------
  */

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#070707] text-white">
        <Navbar />

        <div className="mx-auto flex min-h-[80vh] max-w-5xl items-center justify-center px-6">
          <div className="w-full max-w-md rounded-3xl border border-red-500/20 bg-red-500/5 p-8 text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
              <ShieldCheck className="h-7 w-7 text-red-400" />
            </div>

            <h1 className="text-xl font-semibold">
              Unable to load profile
            </h1>

            <p className="mt-2 text-sm text-white/50">
              {error ||
                "Please log in and try again."}
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#e5c04a]"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const fullName =
    `${profile.firstName} ${profile.lastName}`.trim();

  const initials =
    `${profile.firstName?.charAt(0) || ""}${profile.lastName?.charAt(0) || ""}`.toUpperCase();

  return (
    <main className="min-h-screen bg-[#070707] text-white">
      <Navbar />

      {/* Background */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#D4AF37]/[0.06] blur-[140px]" />

        <div className="absolute bottom-[-300px] right-[-200px] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/[0.035] blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to BookingLK
          </Link>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            My Profile
          </h1>

          <p className="mt-2 text-sm text-white/45 sm:text-base">
            Manage your BookingLK personal information
            and account.
          </p>
        </div>

        {/* Alerts */}
        {success && (
          <div className="mb-6 flex items-center gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] px-5 py-4 text-sm text-emerald-300">
            <CheckCircle2 className="h-5 w-5 shrink-0" />
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/20 bg-red-500/[0.07] px-5 py-4 text-sm text-red-300">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
          {/* Profile Card */}
          <section className="h-fit overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.035] backdrop-blur-xl">
            <div className="p-6">
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="group relative">
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />

                  {/* Avatar */}
                  <button
                    type="button"
                    onClick={openAvatarPicker}
                    disabled={
                      uploadingAvatar ||
                      removingAvatar
                    }
                    aria-label="Change profile picture"
                    className="relative flex h-28 w-28 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/10 text-3xl font-semibold text-[#D4AF37] shadow-[0_0_50px_rgba(212,175,55,0.08)] transition duration-300 hover:scale-[1.03] hover:border-[#D4AF37]/60 hover:shadow-[0_0_60px_rgba(212,175,55,0.15)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {profile.avatar ? (
                      <img
                        src={profile.avatar}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      initials
                    )}

                    {/* Hover overlay */}
                    <span className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 transition duration-300 group-hover:opacity-100">
                      {uploadingAvatar ? (
                        <span className="h-6 w-6 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      ) : (
                        <Camera className="h-6 w-6 text-white" />
                      )}
                    </span>
                  </button>

                  {/* Camera button */}
                  <button
                    type="button"
                    onClick={openAvatarPicker}
                    disabled={
                      uploadingAvatar ||
                      removingAvatar
                    }
                    title="Change profile picture"
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#101010] bg-[#D4AF37] text-black shadow-lg transition hover:scale-105 hover:bg-[#e5c04a] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploadingAvatar ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                    ) : (
                      <Camera className="h-4 w-4" />
                    )}
                  </button>
                </div>

                {/* Avatar actions */}
                <div className="mt-4 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={openAvatarPicker}
                    disabled={
                      uploadingAvatar ||
                      removingAvatar
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-xs font-medium text-white/70 transition hover:border-[#D4AF37]/30 hover:bg-white/[0.06] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    {uploadingAvatar
                      ? "Uploading..."
                      : "Change"}
                  </button>

                  {profile.avatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      disabled={
                        uploadingAvatar ||
                        removingAvatar
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg border border-red-500/15 bg-red-500/[0.04] px-3 py-2 text-xs font-medium text-red-300 transition hover:border-red-500/30 hover:bg-red-500/[0.08] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {removingAvatar
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  )}
                </div>

                <p className="mt-2 text-[11px] text-white/25">
                  JPG, PNG or WebP · Max 5MB
                </p>

                <h2 className="mt-5 text-xl font-semibold">
                  {fullName}
                </h2>

                <p className="mt-1 break-all text-sm text-white/40">
                  {profile.email}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#D4AF37]/20 bg-[#D4AF37]/[0.07] px-3 py-1.5 text-xs font-medium text-[#D4AF37]">
                  <UserIcon className="h-3.5 w-3.5" />
                  {profile.role}
                </div>
              </div>

              <div className="my-6 h-px bg-white/[0.07]" />

              {/* Email status */}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.05]">
                  <Mail className="h-4 w-4 text-white/60" />
                </div>

                <div className="min-w-0">
                  <p className="text-xs text-white/35">
                    Email status
                  </p>

                  <p className="mt-0.5 flex items-center gap-1.5 text-sm">
                    {profile.isEmailVerified ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                        <span className="text-emerald-300">
                          Verified
                        </span>
                      </>
                    ) : (
                      <span className="text-yellow-300">
                        Not verified
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Settings */}
              <Link
                href="/profile/settings"
                className="mt-5 flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 transition hover:border-[#D4AF37]/20 hover:bg-white/[0.05]"
              >
                <div>
                  <p className="text-sm font-medium">
                    Profile Settings
                  </p>

                  <p className="mt-0.5 text-xs text-white/35">
                    Password, email & security
                  </p>
                </div>

                <ChevronRight className="h-4 w-4 text-white/35" />
              </Link>
            </div>
          </section>

          {/* Personal Information */}
          <section className="rounded-3xl border border-white/[0.08] bg-white/[0.035] p-6 backdrop-blur-xl sm:p-8">
            <div className="mb-7">
              <h2 className="text-xl font-semibold">
                Personal Information
              </h2>

              <p className="mt-1 text-sm text-white/40">
                Update the information associated with
                your BookingLK account.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="firstName"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    First Name
                  </label>

                  <input
                    id="firstName"
                    type="text"
                    value={firstName}
                    onChange={(event) =>
                      setFirstName(
                        event.target.value
                      )
                    }
                    placeholder="First name"
                    maxLength={50}
                    className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="mb-2 block text-sm font-medium text-white/75"
                  >
                    Last Name
                  </label>

                  <input
                    id="lastName"
                    type="text"
                    value={lastName}
                    onChange={(event) =>
                      setLastName(
                        event.target.value
                      )
                    }
                    placeholder="Last name"
                    maxLength={50}
                    className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/30 px-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-white/75"
                >
                  Email Address
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="h-12 w-full cursor-not-allowed rounded-xl border border-white/[0.07] bg-white/[0.025] pl-11 pr-4 text-sm text-white/40 outline-none"
                  />
                </div>

                <p className="mt-2 text-xs text-white/30">
                  Email changes can be managed from
                  Profile Settings.
                </p>
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-sm font-medium text-white/75"
                >
                  Phone Number
                </label>

                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />

                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) =>
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="+94 7X XXX XXXX"
                    maxLength={30}
                    className="h-12 w-full rounded-xl border border-white/[0.09] bg-black/30 pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-white/20 focus:border-[#D4AF37]/50 focus:ring-2 focus:ring-[#D4AF37]/10"
                  />
                </div>
              </div>

              {/* Save */}
              <div className="flex justify-end border-t border-white/[0.07] pt-6">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-6 text-sm font-semibold text-black transition hover:bg-[#e5c04a] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}