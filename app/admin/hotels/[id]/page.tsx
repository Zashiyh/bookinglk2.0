
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Edit3,
  Hotel as HotelIcon,
  Loader2,
  MapPin,
  Plus,
  Save,
  ShieldCheck,
  Trash2,
  Users,
  X,
  XCircle,
} from "lucide-react";

type PropertyType =
  | "HOTEL"
  | "RESORT"
  | "VILLA"
  | "APARTMENT"
  | "GUEST_HOUSE"
  | "BOUTIQUE_HOTEL"
  | "HOSTEL"
  | "HOMESTAY";

type RoomType =
  | "STANDARD"
  | "DELUXE"
  | "SUITE"
  | "FAMILY"
  | "VILLA";

type BedType =
  | "SINGLE"
  | "DOUBLE"
  | "QUEEN"
  | "KING"
  | "TWIN";

interface HotelData {
  _id: string;
  name: string;
  slug: string;
  description: string;
  propertyType: PropertyType;

  location: {
    address: string;
    city: string;
    district: string;
    province: string;
    country: string;
  };

  coordinates: {
    type: "Point";
    coordinates: [number, number];
  };

  rating: number;
  reviewCount: number;
  priceFrom: number;
  currency: "LKR";

  amenities: string[];
  images: string[];

  isVerified: boolean;
  isPublished: boolean;

  ownerId: string;

  createdAt: string;
  updatedAt: string;
}

interface Bed {
  type: BedType;
  count: number;
}

interface RoomData {
  _id: string;
  hotelId: string;
  name: string;
  description: string;
  roomType: RoomType;
  pricePerNight: number;
  currency: "LKR";
  maxGuests: number;
  beds: Bed[];
  size?: number;
  amenities: string[];
  images: string[];
  totalRooms: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PROPERTY_TYPES: PropertyType[] = [
  "HOTEL",
  "RESORT",
  "VILLA",
  "APARTMENT",
  "GUEST_HOUSE",
  "BOUTIQUE_HOTEL",
  "HOSTEL",
  "HOMESTAY",
];

const ROOM_TYPES: RoomType[] = [
  "STANDARD",
  "DELUXE",
  "SUITE",
  "FAMILY",
  "VILLA",
];

const BED_TYPES: BedType[] = [
  "SINGLE",
  "DOUBLE",
  "QUEEN",
  "KING",
  "TWIN",
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value?: string) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function emptyRoom(): Partial<RoomData> {
  return {
    name: "",
    description: "",
    roomType: "STANDARD",
    pricePerNight: 0,
    currency: "LKR",
    maxGuests: 2,
    beds: [
      {
        type: "DOUBLE",
        count: 1,
      },
    ],
    size: 0,
    amenities: [],
    images: [],
    totalRooms: 1,
    isActive: true,
  };
}

export default function AdminHotelDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const hotelId = params?.id;

  const [hotel, setHotel] = useState<HotelData | null>(null);
  const [rooms, setRooms] = useState<RoomData[]>([]);

  const [loading, setLoading] = useState(true);
  const [roomsLoading, setRoomsLoading] = useState(false);

  const [savingHotel, setSavingHotel] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);

  const [deletingHotel, setDeletingHotel] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<string | null>(
    null
  );

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [editMode, setEditMode] = useState(false);

  const [roomModal, setRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  const [roomForm, setRoomForm] =
    useState<Partial<RoomData>>(emptyRoom());

  const [hotelForm, setHotelForm] = useState({
    name: "",
    slug: "",
    description: "",
    propertyType: "HOTEL" as PropertyType,

    address: "",
    city: "",
    district: "",
    province: "",
    country: "Sri Lanka",

    longitude: "",
    latitude: "",

    priceFrom: "",
    rating: "0",
    reviewCount: "0",

    amenities: "",
    images: "",

    isVerified: false,
    isPublished: false,
  });

  async function loadHotel() {
    if (!hotelId) return;

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/hotels/${encodeURIComponent(hotelId)}`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to load hotel (${response.status})`
        );
      }

      const data: HotelData = result.data;

      setHotel(data);

      setHotelForm({
        name: data.name || "",
        slug: data.slug || "",
        description: data.description || "",
        propertyType: data.propertyType || "HOTEL",

        address: data.location?.address || "",
        city: data.location?.city || "",
        district: data.location?.district || "",
        province: data.location?.province || "",
        country: data.location?.country || "Sri Lanka",

        longitude: String(
          data.coordinates?.coordinates?.[0] ?? ""
        ),

        latitude: String(
          data.coordinates?.coordinates?.[1] ?? ""
        ),

        priceFrom: String(data.priceFrom ?? ""),
        rating: String(data.rating ?? 0),
        reviewCount: String(data.reviewCount ?? 0),

        amenities: (data.amenities || []).join(", "),
        images: (data.images || []).join("\n"),

        isVerified: Boolean(data.isVerified),
        isPublished: Boolean(data.isPublished),
      });

      await loadRooms();
    } catch (error) {
      console.error("ADMIN_HOTEL_DETAILS_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load hotel."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadRooms() {
    if (!hotelId) return;

    try {
      setRoomsLoading(true);

      const response = await fetch(
        `/api/admin/hotels/${encodeURIComponent(
          hotelId
        )}/rooms`,
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to load rooms (${response.status})`
        );
      }

      setRooms(result.data || []);
    } catch (error) {
      console.error("ADMIN_ROOMS_LOAD_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to load rooms."
      );
    } finally {
      setRoomsLoading(false);
    }
  }

  useEffect(() => {
    if (!hotelId) return;

    loadHotel();
  }, [hotelId]);

  function updateHotelField(
    field: string,
    value: string | boolean
  ) {
    setHotelForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  async function saveHotel() {
    if (!hotel || !hotelId) return;

    try {
      setSavingHotel(true);
      setError("");
      setSuccess("");

      const longitude = Number(hotelForm.longitude);
      const latitude = Number(hotelForm.latitude);

      if (!hotelForm.name.trim()) {
        throw new Error("Hotel name is required.");
      }

      if (!hotelForm.slug.trim()) {
        throw new Error("Hotel slug is required.");
      }

      if (!hotelForm.description.trim()) {
        throw new Error("Hotel description is required.");
      }

      if (!hotelForm.city.trim()) {
        throw new Error("Hotel city is required.");
      }

      if (!hotelForm.district.trim()) {
        throw new Error("Hotel district is required.");
      }

      if (!hotelForm.province.trim()) {
        throw new Error("Hotel province is required.");
      }

      if (
        !Number.isFinite(longitude) ||
        longitude < -180 ||
        longitude > 180
      ) {
        throw new Error("Invalid longitude.");
      }

      if (
        !Number.isFinite(latitude) ||
        latitude < -90 ||
        latitude > 90
      ) {
        throw new Error("Invalid latitude.");
      }

      const amenities = hotelForm.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

      const images = hotelForm.images
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

      const payload = {
        name: hotelForm.name.trim(),
        slug: hotelForm.slug.trim().toLowerCase(),
        description: hotelForm.description.trim(),

        propertyType: hotelForm.propertyType,

        location: {
          address: hotelForm.address.trim(),
          city: hotelForm.city.trim(),
          district: hotelForm.district.trim(),
          province: hotelForm.province.trim(),
          country:
            hotelForm.country.trim() || "Sri Lanka",
        },

        coordinates: {
          type: "Point",
          coordinates: [longitude, latitude],
        },

        rating: Number(hotelForm.rating) || 0,
        reviewCount:
          Number(hotelForm.reviewCount) || 0,

        priceFrom:
          Number(hotelForm.priceFrom) || 0,

        currency: "LKR",

        amenities,
        images,

        isVerified: hotelForm.isVerified,
        isPublished: hotelForm.isPublished,

        ownerId: hotel.ownerId,
      };

      const response = await fetch(
        `/api/admin/hotels/${encodeURIComponent(hotelId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to update hotel (${response.status})`
        );
      }

      setHotel(result.data);
      setEditMode(false);

      setSuccess("Hotel updated successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("ADMIN_HOTEL_UPDATE_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to update hotel."
      );
    } finally {
      setSavingHotel(false);
    }
  }

  async function deleteHotel() {
    if (!hotel || !hotelId) return;

    const confirmed = window.confirm(
      `Delete "${hotel.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingHotel(true);
      setError("");

      const response = await fetch(
        `/api/admin/hotels/${encodeURIComponent(hotelId)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to delete hotel (${response.status})`
        );
      }

      router.push("/admin/hotels");
    } catch (error) {
      console.error("ADMIN_HOTEL_DELETE_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete hotel."
      );
    } finally {
      setDeletingHotel(false);
    }
  }

  function openAddRoom() {
    setEditingRoomId(null);
    setRoomForm(emptyRoom());
    setRoomModal(true);
    setError("");
  }

  function openEditRoom(room: RoomData) {
    setEditingRoomId(room._id);

    setRoomForm({
      name: room.name,
      description: room.description,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      currency: "LKR",
      maxGuests: room.maxGuests,
      beds: room.beds || [],
      size: room.size || 0,
      amenities: room.amenities || [],
      images: room.images || [],
      totalRooms: room.totalRooms,
      isActive: room.isActive,
    });

    setRoomModal(true);
    setError("");
  }

  function closeRoomModal() {
    if (savingRoom) return;

    setRoomModal(false);
    setEditingRoomId(null);
    setRoomForm(emptyRoom());
  }

  function updateRoomField(
    field: keyof RoomData,
    value: unknown
  ) {
    setRoomForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function addBed() {
    const currentBeds = roomForm.beds || [];

    updateRoomField("beds", [
      ...currentBeds,
      {
        type: "DOUBLE",
        count: 1,
      },
    ]);
  }

  function updateBed(
    index: number,
    field: "type" | "count",
    value: string | number
  ) {
    const currentBeds = [...(roomForm.beds || [])];

    currentBeds[index] = {
      ...currentBeds[index],
      [field]: value,
    } as Bed;

    updateRoomField("beds", currentBeds);
  }

  function removeBed(index: number) {
    const currentBeds = [...(roomForm.beds || [])];

    currentBeds.splice(index, 1);

    updateRoomField("beds", currentBeds);
  }

  async function saveRoom() {
    if (!hotelId) return;

    try {
      setSavingRoom(true);
      setError("");
      setSuccess("");

      if (!String(roomForm.name || "").trim()) {
        throw new Error("Room name is required.");
      }

      if (!String(roomForm.description || "").trim()) {
        throw new Error("Room description is required.");
      }

      const price = Number(
        roomForm.pricePerNight
      );

      const maxGuests = Number(
        roomForm.maxGuests
      );

      const totalRooms = Number(
        roomForm.totalRooms
      );

      if (!Number.isFinite(price) || price < 0) {
        throw new Error(
          "Valid room price is required."
        );
      }

      if (
        !Number.isFinite(maxGuests) ||
        maxGuests < 1
      ) {
        throw new Error(
          "Valid maximum guests value is required."
        );
      }

      if (
        !Number.isFinite(totalRooms) ||
        totalRooms < 1
      ) {
        throw new Error(
          "Valid total rooms value is required."
        );
      }

      const beds = (roomForm.beds || []).map(
        (bed) => ({
          type: bed.type,
          count: Number(bed.count),
        })
      );

      if (beds.length === 0) {
        throw new Error(
          "At least one bed is required."
        );
      }

      const payload = {
        name: String(roomForm.name).trim(),

        description: String(
          roomForm.description
        ).trim(),

        roomType:
          roomForm.roomType || "STANDARD",

        pricePerNight: price,

        currency: "LKR",

        maxGuests,

        beds,

        size:
          Number(roomForm.size) > 0
            ? Number(roomForm.size)
            : undefined,

        amenities: Array.isArray(
          roomForm.amenities
        )
          ? roomForm.amenities
          : [],

        images: Array.isArray(
          roomForm.images
        )
          ? roomForm.images
          : [],

        totalRooms,

        isActive:
          roomForm.isActive !== false,
      };

      const url = editingRoomId
        ? `/api/admin/hotels/${encodeURIComponent(
            hotelId
          )}/rooms/${encodeURIComponent(
            editingRoomId
          )}`
        : `/api/admin/hotels/${encodeURIComponent(
            hotelId
          )}/rooms`;

      const response = await fetch(url, {
        method: editingRoomId
          ? "PATCH"
          : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        credentials: "include",

        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to save room (${response.status})`
        );
      }

      await loadRooms();

      closeRoomModal();

      setSuccess(
        editingRoomId
          ? "Room updated successfully."
          : "Room created successfully."
      );

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("ADMIN_ROOM_SAVE_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to save room."
      );
    } finally {
      setSavingRoom(false);
    }
  }

  async function deleteRoom(room: RoomData) {
    if (!hotelId) return;

    const confirmed = window.confirm(
      `Delete room "${room.name}"?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setDeletingRoomId(room._id);
      setError("");

      const response = await fetch(
        `/api/admin/hotels/${encodeURIComponent(
          hotelId
        )}/rooms/${encodeURIComponent(
          room._id
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            `Unable to delete room (${response.status})`
        );
      }

      setRooms((previous) =>
        previous.filter(
          (item) => item._id !== room._id
        )
      );

      setSuccess("Room deleted successfully.");

      setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (error) {
      console.error("ADMIN_ROOM_DELETE_ERROR:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete room."
      );
    } finally {
      setDeletingRoomId(null);
    }
  }

  async function toggleHotelPublish() {
    if (!hotel) return;

    await updateHotelQuick({
      isPublished: !hotel.isPublished,
    });
  }

  async function toggleHotelVerified() {
    if (!hotel) return;

    await updateHotelQuick({
      isVerified: !hotel.isVerified,
    });
  }

  async function updateHotelQuick(
    update: Partial<HotelData>
  ) {
    if (!hotel || !hotelId) return;

    try {
      setError("");
      setSuccess("");

      const response = await fetch(
        `/api/admin/hotels/${encodeURIComponent(hotelId)}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(update),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Unable to update hotel."
        );
      }

      setHotel(result.data);

      setHotelForm((previous) => ({
        ...previous,
        isPublished: Boolean(
          result.data.isPublished
        ),
        isVerified: Boolean(
          result.data.isVerified
        ),
      }));

      setSuccess("Hotel status updated.");

      setTimeout(() => {
        setSuccess("");
      }, 2500);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update hotel."
      );
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-9 w-9 animate-spin text-[#D4AF37]" />

          <p className="mt-4 text-sm text-zinc-500">
            Loading hotel...
          </p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="p-6">
        <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-10 text-center">
          <XCircle className="mx-auto h-10 w-10 text-red-400" />

          <h2 className="mt-4 text-xl font-bold">
            Unable to load hotel
          </h2>

          <p className="mt-2 text-sm text-zinc-500">
            {error || "Hotel not found."}
          </p>

          <button
            type="button"
            onClick={() =>
              router.push("/admin/hotels")
            }
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hotels
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen px-4 pb-10 sm:px-6 lg:px-8">
        {/* HEADER */}

        <div className="mb-8">
          <button
            type="button"
            onClick={() =>
              router.push("/admin/hotels")
            }
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-zinc-500 transition hover:text-[#D4AF37]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to hotels
          </button>

          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
                <Building2 className="h-4 w-4" />
                Hotel management
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {hotel.name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
                <span className="font-mono">
                  /{hotel.slug}
                </span>

                <span>•</span>

                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {hotel.location?.city}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  setEditMode((value) => !value)
                }
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm font-bold shadow-sm transition hover:border-[#D4AF37]/40 dark:border-white/10 dark:bg-white/[0.025]"
              >
                {editMode ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel edit
                  </>
                ) : (
                  <>
                    <Edit3 className="h-4 w-4" />
                    Edit hotel
                  </>
                )}
              </button>

              <button
                type="button"
                disabled={deletingHotel}
                onClick={deleteHotel}
                className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-2.5 text-sm font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
              >
                {deletingHotel ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
                Delete
              </button>
            </div>
          </div>
        </div>

        {/* ALERTS */}

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-sm text-emerald-400">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* STATUS CARDS */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatusCard
            title="Property type"
            value={hotel.propertyType.replaceAll(
              "_",
              " "
            )}
            icon={<Building2 className="h-5 w-5" />}
          />

          <StatusCard
            title="Rating"
            value={`${hotel.rating.toFixed(1)} / 5`}
            icon={<HotelIcon className="h-5 w-5" />}
          />

          <button
            type="button"
            onClick={toggleHotelVerified}
            className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-[#D4AF37]/30 dark:border-white/10 dark:bg-white/[0.025]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                Verification
              </span>

              <ShieldCheck
                className={`h-5 w-5 ${
                  hotel.isVerified
                    ? "text-emerald-400"
                    : "text-zinc-500"
                }`}
              />
            </div>

            <p className="mt-3 text-lg font-bold">
              {hotel.isVerified
                ? "Verified"
                : "Not verified"}
            </p>
          </button>

          <button
            type="button"
            onClick={toggleHotelPublish}
            className="rounded-2xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:border-[#D4AF37]/30 dark:border-white/10 dark:bg-white/[0.025]"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-zinc-500">
                Visibility
              </span>

              {hotel.isPublished ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              ) : (
                <XCircle className="h-5 w-5 text-zinc-500" />
              )}
            </div>

            <p className="mt-3 text-lg font-bold">
              {hotel.isPublished
                ? "Published"
                : "Draft"}
            </p>
          </button>
        </div>

        {/* MAIN */}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT */}

          <div className="space-y-6">
            {/* HOTEL INFORMATION */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
              <div className="mb-6 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold">
                    Hotel information
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Core property information
                  </p>
                </div>

                {!editMode && (
                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                    Active
                  </span>
                )}
              </div>

              {editMode ? (
                <div className="space-y-6">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="Hotel name"
                      value={hotelForm.name}
                      onChange={(value) =>
                        updateHotelField(
                          "name",
                          value
                        )
                      }
                    />

                    <Field
                      label="Slug"
                      value={hotelForm.slug}
                      onChange={(value) =>
                        updateHotelField(
                          "slug",
                          value
                        )
                      }
                    />

                    <SelectField
                      label="Property type"
                      value={
                        hotelForm.propertyType
                      }
                      options={PROPERTY_TYPES}
                      onChange={(value) =>
                        updateHotelField(
                          "propertyType",
                          value
                        )
                      }
                    />

                    <Field
                      label="Starting price"
                      type="number"
                      value={
                        hotelForm.priceFrom
                      }
                      onChange={(value) =>
                        updateHotelField(
                          "priceFrom",
                          value
                        )
                      }
                    />
                  </div>

                  <TextAreaField
                    label="Description"
                    value={hotelForm.description}
                    onChange={(value) =>
                      updateHotelField(
                        "description",
                        value
                      )
                    }
                  />

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Amenities
                    </label>

                    <input
                      value={hotelForm.amenities}
                      onChange={(event) =>
                        updateHotelField(
                          "amenities",
                          event.target.value
                        )
                      }
                      placeholder="WiFi, Pool, Parking, Restaurant"
                      className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
                    />

                    <p className="mt-2 text-xs text-zinc-500">
                      Separate amenities with commas.
                    </p>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Image URLs
                    </label>

                    <textarea
                      value={hotelForm.images}
                      onChange={(event) =>
                        updateHotelField(
                          "images",
                          event.target.value
                        )
                      }
                      rows={4}
                      placeholder="https://..."
                      className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
                    />

                    <p className="mt-2 text-xs text-zinc-500">
                      One image URL per line.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-wider text-zinc-500">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                      {hotel.description}
                    </p>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <InfoItem
                      label="Starting price"
                      value={formatCurrency(
                        hotel.priceFrom
                      )}
                    />

                    <InfoItem
                      label="Reviews"
                      value={String(
                        hotel.reviewCount
                      )}
                    />

                    <InfoItem
                      label="Created"
                      value={formatDate(
                        hotel.createdAt
                      )}
                    />

                    <InfoItem
                      label="Updated"
                      value={formatDate(
                        hotel.updatedAt
                      )}
                    />
                  </div>

                  {hotel.amenities?.length > 0 && (
                    <div>
                      <p className="mb-3 text-xs uppercase tracking-wider text-zinc-500">
                        Amenities
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {hotel.amenities.map(
                          (amenity) => (
                            <span
                              key={amenity}
                              className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-medium dark:border-white/10"
                            >
                              {amenity}
                            </span>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {editMode && (
                <div className="mt-6 flex flex-wrap justify-end gap-3 border-t border-zinc-200 pt-5 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() =>
                      setEditMode(false)
                    }
                    className="rounded-xl border border-zinc-200 px-4 py-2.5 text-sm font-bold dark:border-white/10"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    disabled={savingHotel}
                    onClick={saveHotel}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black transition hover:brightness-105 disabled:opacity-50"
                  >
                    {savingHotel ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save changes
                  </button>
                </div>
              )}
            </section>

            {/* LOCATION */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#D4AF37]/10">
                  <MapPin className="h-5 w-5 text-[#D4AF37]" />
                </div>

                <div>
                  <h2 className="font-bold">
                    Location
                  </h2>

                  <p className="text-xs text-zinc-500">
                    Property address and coordinates
                  </p>
                </div>
              </div>

              {editMode ? (
                <div className="space-y-5">
                  <Field
                    label="Address"
                    value={hotelForm.address}
                    onChange={(value) =>
                      updateHotelField(
                        "address",
                        value
                      )
                    }
                  />

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field
                      label="City"
                      value={hotelForm.city}
                      onChange={(value) =>
                        updateHotelField(
                          "city",
                          value
                        )
                      }
                    />

                    <Field
                      label="District"
                      value={hotelForm.district}
                      onChange={(value) =>
                        updateHotelField(
                          "district",
                          value
                        )
                      }
                    />

                    <Field
                      label="Province"
                      value={hotelForm.province}
                      onChange={(value) =>
                        updateHotelField(
                          "province",
                          value
                        )
                      }
                    />

                    <Field
                      label="Country"
                      value={hotelForm.country}
                      onChange={(value) =>
                        updateHotelField(
                          "country",
                          value
                        )
                      }
                    />

                    <Field
                      label="Longitude"
                      type="number"
                      value={hotelForm.longitude}
                      onChange={(value) =>
                        updateHotelField(
                          "longitude",
                          value
                        )
                      }
                    />

                    <Field
                      label="Latitude"
                      type="number"
                      value={hotelForm.latitude}
                      onChange={(value) =>
                        updateHotelField(
                          "latitude",
                          value
                        )
                      }
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <InfoItem
                      label="Address"
                      value={
                        hotel.location?.address
                      }
                    />
                  </div>

                  <InfoItem
                    label="City"
                    value={
                      hotel.location?.city
                    }
                  />

                  <InfoItem
                    label="District"
                    value={
                      hotel.location?.district
                    }
                  />

                  <InfoItem
                    label="Province"
                    value={
                      hotel.location?.province
                    }
                  />

                  <InfoItem
                    label="Country"
                    value={
                      hotel.location?.country
                    }
                  />

                  <InfoItem
                    label="Coordinates"
                    value={`${hotel.coordinates.coordinates[1]}, ${hotel.coordinates.coordinates[0]}`}
                  />
                </div>
              )}
            </section>

            {/* ROOMS */}

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-lg font-bold">
                    Rooms
                  </h2>

                  <p className="mt-1 text-xs text-zinc-500">
                    Manage rooms available at this property
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openAddRoom}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black transition hover:brightness-105"
                >
                  <Plus className="h-4 w-4" />
                  Add room
                </button>
              </div>

              {roomsLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-7 w-7 animate-spin text-[#D4AF37]" />
                </div>
              ) : rooms.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-zinc-300 px-6 py-14 text-center dark:border-white/10">
                  <HotelIcon className="mx-auto h-9 w-9 text-zinc-400" />

                  <h3 className="mt-4 font-bold">
                    No rooms yet
                  </h3>

                  <p className="mt-2 text-sm text-zinc-500">
                    Add the first room for this hotel.
                  </p>

                  <button
                    type="button"
                    onClick={openAddRoom}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
                  >
                    <Plus className="h-4 w-4" />
                    Add first room
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {rooms.map((room) => (
                    <div
                      key={room._id}
                      className="rounded-2xl border border-zinc-200 p-4 transition hover:border-[#D4AF37]/30 dark:border-white/10"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold">
                              {room.name}
                            </h3>

                            <span className="rounded-full bg-[#D4AF37]/10 px-2.5 py-1 text-[11px] font-semibold uppercase text-[#D4AF37]">
                              {room.roomType}
                            </span>

                            <span
                              className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                room.isActive
                                  ? "bg-emerald-500/10 text-emerald-400"
                                  : "bg-zinc-500/10 text-zinc-500"
                              }`}
                            >
                              {room.isActive
                                ? "Active"
                                : "Inactive"}
                            </span>
                          </div>

                          <p className="mt-2 line-clamp-2 text-sm text-zinc-500">
                            {room.description}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-4 text-xs text-zinc-500">
                            <span>
                              {formatCurrency(
                                room.pricePerNight
                              )}
                              {" / night"}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <Users className="h-3.5 w-3.5" />
                              {room.maxGuests} guests
                            </span>

                            <span>
                              {room.totalRooms} rooms
                            </span>

                            {room.size ? (
                              <span>
                                {room.size} m²
                              </span>
                            ) : null}
                          </div>
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditRoom(room)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 px-3 py-2 text-xs font-bold transition hover:border-[#D4AF37]/40 dark:border-white/10"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                            Edit
                          </button>

                          <button
                            type="button"
                            disabled={
                              deletingRoomId ===
                              room._id
                            }
                            onClick={() =>
                              deleteRoom(room)
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10 disabled:opacity-50"
                          >
                            {deletingRoomId ===
                            room._id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="h-3.5 w-3.5" />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>

                      {room.beds?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2 border-t border-zinc-200 pt-4 dark:border-white/10">
                          {room.beds.map(
                            (bed, index) => (
                              <span
                                key={`${bed.type}-${index}`}
                                className="rounded-lg bg-zinc-100 px-2.5 py-1.5 text-xs text-zinc-600 dark:bg-white/5 dark:text-zinc-400"
                              >
                                {bed.count} ×{" "}
                                {bed.type}
                              </span>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* RIGHT SIDEBAR */}

          <aside className="h-fit space-y-6">
            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
              <h2 className="font-bold">
                Property status
              </h2>

              <div className="mt-5 space-y-4">
                <StatusRow
                  label="Published"
                  value={
                    hotel.isPublished
                      ? "Yes"
                      : "No"
                  }
                  active={hotel.isPublished}
                />

                <StatusRow
                  label="Verified"
                  value={
                    hotel.isVerified
                      ? "Yes"
                      : "No"
                  }
                  active={hotel.isVerified}
                />

                <StatusRow
                  label="Rooms"
                  value={String(rooms.length)}
                  active={rooms.length > 0}
                />
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
              <h2 className="font-bold">
                Pricing
              </h2>

              <div className="mt-5">
                <p className="text-xs uppercase tracking-wider text-zinc-500">
                  Starting from
                </p>

                <p className="mt-2 text-3xl font-extrabold text-[#D4AF37]">
                  {formatCurrency(
                    hotel.priceFrom
                  )}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  per night
                </p>
              </div>
            </section>

            <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
              <h2 className="font-bold">
                Property metadata
              </h2>

              <div className="mt-5 space-y-4">
                <InfoItem
                  label="Hotel ID"
                  value={hotel._id}
                />

                <InfoItem
                  label="Created"
                  value={formatDate(
                    hotel.createdAt
                  )}
                />

                <InfoItem
                  label="Last updated"
                  value={formatDate(
                    hotel.updatedAt
                  )}
                />
              </div>
            </section>
          </aside>
        </div>
      </div>

      {/* ROOM MODAL */}

      {roomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-zinc-200 bg-white shadow-2xl dark:border-white/10 dark:bg-[#111111]">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white/95 px-6 py-5 backdrop-blur dark:border-white/10 dark:bg-[#111111]/95">
              <div>
                <h2 className="text-xl font-bold">
                  {editingRoomId
                    ? "Edit room"
                    : "Add room"}
                </h2>

                <p className="mt-1 text-xs text-zinc-500">
                  Room configuration
                </p>
              </div>

              <button
                type="button"
                onClick={closeRoomModal}
                disabled={savingRoom}
                className="rounded-xl p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-white/5 dark:hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6 p-6">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field
                  label="Room name"
                  value={String(
                    roomForm.name || ""
                  )}
                  onChange={(value) =>
                    updateRoomField(
                      "name",
                      value
                    )
                  }
                />

                <SelectField
                  label="Room type"
                  value={
                    roomForm.roomType ||
                    "STANDARD"
                  }
                  options={ROOM_TYPES}
                  onChange={(value) =>
                    updateRoomField(
                      "roomType",
                      value
                    )
                  }
                />

                <Field
                  label="Price per night"
                  type="number"
                  value={String(
                    roomForm.pricePerNight ??
                      ""
                  )}
                  onChange={(value) =>
                    updateRoomField(
                      "pricePerNight",
                      Number(value)
                    )
                  }
                />

                <Field
                  label="Maximum guests"
                  type="number"
                  value={String(
                    roomForm.maxGuests ??
                      ""
                  )}
                  onChange={(value) =>
                    updateRoomField(
                      "maxGuests",
                      Number(value)
                    )
                  }
                />

                <Field
                  label="Total rooms"
                  type="number"
                  value={String(
                    roomForm.totalRooms ??
                      ""
                  )}
                  onChange={(value) =>
                    updateRoomField(
                      "totalRooms",
                      Number(value)
                    )
                  }
                />

                <Field
                  label="Room size (m²)"
                  type="number"
                  value={String(
                    roomForm.size || ""
                  )}
                  onChange={(value) =>
                    updateRoomField(
                      "size",
                      Number(value)
                    )
                  }
                />
              </div>

              <TextAreaField
                label="Description"
                value={String(
                  roomForm.description ||
                    ""
                )}
                onChange={(value) =>
                  updateRoomField(
                    "description",
                    value
                  )
                }
              />

              {/* BEDS */}

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Beds
                    </label>

                    <p className="mt-1 text-xs text-zinc-500">
                      Configure the beds included in this room.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={addBed}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/30 px-3 py-2 text-xs font-bold text-[#D4AF37]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add bed
                  </button>
                </div>

                <div className="space-y-3">
                  {(roomForm.beds || []).map(
                    (bed, index) => (
                      <div
                        key={index}
                        className="flex gap-3"
                      >
                        <div className="relative flex-1">
                          <select
                            value={bed.type}
                            onChange={(event) =>
                              updateBed(
                                index,
                                "type",
                                event.target.value as BedType
                              )
                            }
                            className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
                          >
                            {BED_TYPES.map(
                              (type) => (
                                <option
                                  key={type}
                                  value={type}
                                >
                                  {type}
                                </option>
                              )
                            )}
                          </select>

                          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        </div>

                        <input
                          type="number"
                          min={1}
                          value={bed.count}
                          onChange={(event) =>
                            updateBed(
                              index,
                              "count",
                              Number(
                                event.target
                                  .value
                              )
                            )
                          }
                          className="w-24 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeBed(index)
                          }
                          className="rounded-xl border border-red-500/20 px-3 text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  )}
                </div>
              </div>

              {/* AMENITIES */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Room amenities
                </label>

                <input
                  value={(
                    roomForm.amenities || []
                  ).join(", ")}
                  onChange={(event) =>
                    updateRoomField(
                      "amenities",
                      event.target.value
                        .split(",")
                        .map(
                          (item) =>
                            item.trim()
                        )
                        .filter(Boolean)
                    )
                  }
                  placeholder="WiFi, TV, AC, Balcony"
                  className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
                />
              </div>

              {/* IMAGES */}

              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Room image URLs
                </label>

                <textarea
                  value={(
                    roomForm.images || []
                  ).join("\n")}
                  onChange={(event) =>
                    updateRoomField(
                      "images",
                      event.target.value
                        .split("\n")
                        .map(
                          (item) =>
                            item.trim()
                        )
                        .filter(Boolean)
                    )
                  }
                  rows={4}
                  placeholder="https://..."
                  className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
                />
              </div>

              {/* ACTIVE */}

              <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-zinc-200 p-4 dark:border-white/10">
                <div>
                  <p className="text-sm font-semibold">
                    Room active
                  </p>

                  <p className="mt-1 text-xs text-zinc-500">
                    Active rooms can be used for bookings.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={
                    roomForm.isActive !== false
                  }
                  onChange={(event) =>
                    updateRoomField(
                      "isActive",
                      event.target.checked
                    )
                  }
                  className="h-5 w-5 accent-[#D4AF37]"
                />
              </label>
            </div>

            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-zinc-200 bg-white/95 px-6 py-5 backdrop-blur sm:flex-row sm:justify-end dark:border-white/10 dark:bg-[#111111]/95">
              <button
                type="button"
                onClick={closeRoomModal}
                disabled={savingRoom}
                className="rounded-xl border border-zinc-200 px-5 py-2.5 text-sm font-bold dark:border-white/10"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={savingRoom}
                onClick={saveRoom}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black disabled:opacity-50"
              >
                {savingRoom ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}

                {editingRoomId
                  ? "Update room"
                  : "Create room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function StatusCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-white/[0.025]">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">
          {title}
        </span>

        <div className="text-[#D4AF37]">
          {icon}
        </div>
      </div>

      <p className="mt-3 truncate text-lg font-bold capitalize">
        {value}
      </p>
    </div>
  );
}

function StatusRow({
  label,
  value,
  active,
}: {
  label: string;
  value: string;
  active: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-sm text-zinc-500">
        {label}
      </span>

      <span
        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
          active
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-zinc-500/10 text-zinc-500"
        }`}
      >
        {active && (
          <Check className="h-3 w-3" />
        )}

        {value}
      </span>
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value?: string;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-zinc-500">
        {label}
      </p>

      <p className="mt-2 break-words text-sm font-semibold">
        {value || "—"}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
      />
    </div>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        rows={5}
        className="w-full resize-none rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
      />
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
        {label}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="w-full appearance-none rounded-xl border border-zinc-200 bg-white px-4 py-3 pr-10 text-sm outline-none transition focus:border-[#D4AF37] dark:border-white/10 dark:bg-black/20"
        >
          {options.map((option) => (
            <option
              key={option}
              value={option}
            >
              {option.replaceAll("_", " ")}
            </option>
          ))}
        </select>

        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
      </div>
    </div>
  );
}

