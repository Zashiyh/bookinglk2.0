import "dotenv/config";
import mongoose from "mongoose";

import { connectDB } from "@/lib/db/mongoose";
import { Hotel } from "@/models/Hotel";
import { User } from "@/models/User";

const hotels = [
  {
    name: "Kandy Lake Grand",
    slug: "kandy-lake-grand",

    description:
      "A premium city escape overlooking the beautiful surroundings of Kandy, offering elegant rooms, modern amenities and easy access to the city's cultural attractions.",

    propertyType: "HOTEL",

    location: {
      address: "Kandy Lake Road, Kandy",
      city: "Kandy",
      district: "Kandy",
      province: "Central Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [80.6337, 7.2906],
    },

    rating: 4.7,
    reviewCount: 328,

    priceFrom: 28000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Swimming Pool",
      "Parking",
      "Breakfast",
      "Restaurant",
      "Air Conditioning",
    ],

    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Colombo Ocean Pearl",
    slug: "colombo-ocean-pearl",

    description:
      "A stylish urban stay close to Colombo's business district, shopping destinations and the Indian Ocean coastline.",

    propertyType: "HOTEL",

    location: {
      address: "Marine Drive, Colombo",
      city: "Colombo",
      district: "Colombo",
      province: "Western Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [79.8612, 6.9271],
    },

    rating: 4.6,
    reviewCount: 512,

    priceFrom: 32000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Swimming Pool",
      "Gym",
      "Restaurant",
      "Spa",
      "Airport Shuttle",
      "Air Conditioning",
    ],

    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Ella Mountain Retreat",
    slug: "ella-mountain-retreat",

    description:
      "A peaceful mountain retreat surrounded by the spectacular landscapes of Ella, perfect for nature lovers and adventure travellers.",

    propertyType: "RESORT",

    location: {
      address: "Passara Road, Ella",
      city: "Ella",
      district: "Badulla",
      province: "Uva Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [81.0466, 6.8667],
    },

    rating: 4.9,
    reviewCount: 741,

    priceFrom: 24000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Breakfast",
      "Restaurant",
      "Parking",
      "Mountain View",
      "Air Conditioning",
    ],

    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
      "https://images.unsplash.com/photo-1601918774946-25832a4be0d6",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Galle Fort Heritage Villa",
    slug: "galle-fort-heritage-villa",

    description:
      "A charming heritage-inspired villa near the historic Galle Fort, combining traditional Sri Lankan character with modern comfort.",

    propertyType: "VILLA",

    location: {
      address: "Galle Fort, Galle",
      city: "Galle",
      district: "Galle",
      province: "Southern Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [80.217, 6.0329],
    },

    rating: 4.8,
    reviewCount: 286,

    priceFrom: 35000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Swimming Pool",
      "Breakfast",
      "Restaurant",
      "Air Conditioning",
      "Parking",
    ],

    images: [
      "https://images.unsplash.com/photo-1584132967334-10e028bd69f7",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Nuwara Eliya Hillside Lodge",
    slug: "nuwara-eliya-hillside-lodge",

    description:
      "A cosy hillside property surrounded by tea country and cool mountain air, ideal for relaxing getaways in Nuwara Eliya.",

    propertyType: "BOUTIQUE_HOTEL",

    location: {
      address: "Hillside Road, Nuwara Eliya",
      city: "Nuwara Eliya",
      district: "Nuwara Eliya",
      province: "Central Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [80.7718, 6.9497],
    },

    rating: 4.5,
    reviewCount: 194,

    priceFrom: 22000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Breakfast",
      "Parking",
      "Restaurant",
      "Mountain View",
      "Heating",
    ],

    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739",
      "https://images.unsplash.com/photo-1445019980597-93fa8acb246c",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Mirissa Beach Escape",
    slug: "mirissa-beach-escape",

    description:
      "A relaxed coastal stay just moments from the famous beaches of Mirissa, designed for travellers looking for sun, sea and tropical experiences.",

    propertyType: "RESORT",

    location: {
      address: "Beach Road, Mirissa",
      city: "Mirissa",
      district: "Matara",
      province: "Southern Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [80.4588, 5.9483],
    },

    rating: 4.7,
    reviewCount: 432,

    priceFrom: 26000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Swimming Pool",
      "Beach Access",
      "Breakfast",
      "Restaurant",
      "Airport Shuttle",
    ],

    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Sigiriya Heritage Stay",
    slug: "sigiriya-heritage-stay",

    description:
      "A peaceful stay surrounded by the natural beauty and cultural heritage of Sigiriya, ideal for exploring the ancient rock fortress and nearby attractions.",

    propertyType: "GUEST_HOUSE",

    location: {
      address: "Sigiriya Road, Sigiriya",
      city: "Sigiriya",
      district: "Matale",
      province: "Central Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [80.7603, 7.957],
    },

    rating: 4.6,
    reviewCount: 217,

    priceFrom: 15000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Breakfast",
      "Parking",
      "Restaurant",
      "Air Conditioning",
    ],

    images: [
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Bentota Palm Resort",
    slug: "bentota-palm-resort",

    description:
      "A tropical resort experience near Bentota's golden beaches, featuring spacious rooms, a swimming pool and relaxing surroundings.",

    propertyType: "RESORT",

    location: {
      address: "Beach Road, Bentota",
      city: "Bentota",
      district: "Galle",
      province: "Southern Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [80.0, 6.4211],
    },

    rating: 4.4,
    reviewCount: 365,

    priceFrom: 30000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Swimming Pool",
      "Beach Access",
      "Restaurant",
      "Spa",
      "Parking",
      "Gym",
    ],

    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
      "https://images.unsplash.com/photo-1568084680786-a84f91d1153c",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Negombo Lagoon Retreat",
    slug: "negombo-lagoon-retreat",

    description:
      "A comfortable coastal retreat near Negombo Lagoon and the beach, offering convenient access to Colombo and Bandaranaike International Airport.",

    propertyType: "HOTEL",

    location: {
      address: "Lagoon Road, Negombo",
      city: "Negombo",
      district: "Gampaha",
      province: "Western Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [79.8358, 7.2083],
    },

    rating: 4.5,
    reviewCount: 276,

    priceFrom: 21000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Swimming Pool",
      "Airport Shuttle",
      "Restaurant",
      "Breakfast",
      "Parking",
    ],

    images: [
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791",
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb",
    ],

    isVerified: true,
    isPublished: true,
  },

  {
    name: "Trinco Ocean Breeze",
    slug: "trinco-ocean-breeze",

    description:
      "A tropical coastal property in Trincomalee, offering easy access to beautiful beaches and the region's famous marine attractions.",

    propertyType: "HOTEL",

    location: {
      address: "Uppuveli Beach Road, Trincomalee",
      city: "Trincomalee",
      district: "Trincomalee",
      province: "Eastern Province",
      country: "Sri Lanka",
    },

    coordinates: {
      type: "Point",
      coordinates: [81.218, 8.5874],
    },

    rating: 4.6,
    reviewCount: 188,

    priceFrom: 19000,
    currency: "LKR",

    amenities: [
      "WiFi",
      "Beach Access",
      "Swimming Pool",
      "Breakfast",
      "Restaurant",
      "Parking",
    ],

    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6",
    ],

    isVerified: true,
    isPublished: true,
  },
];

async function seedHotels() {
  try {
    console.log("Connecting to MongoDB...");

    await connectDB();

    console.log("MongoDB connected.");

    /*
     * Find or create a development owner.
     *
     * Hotel.ownerId is required by the Hotel model.
     */

    let owner = await User.findOne({
      email: "demo-owner@bookinglk.dev",
    });

    if (!owner) {
      owner = await User.create({
        name: "BookingLK Demo Owner",
        email: "demo-owner@bookinglk.dev",
        password: "development-only-password",
        role: "HOTEL_OWNER",
        isActive: true,
        isEmailVerified: true,
      });

      console.log("Created demo hotel owner.");
    }

    /*
     * Remove previous seed hotels.
     *
     * This prevents duplicates when running the seed again.
     */

    await Hotel.deleteMany({
      ownerId: owner._id,
    });

    /*
     * Add ownerId to every hotel.
     */

    const hotelsWithOwner = hotels.map((hotel) => ({
      ...hotel,
      ownerId: owner._id,
    }));

    const createdHotels =
      await Hotel.insertMany(hotelsWithOwner);

    console.log(
      `Successfully seeded ${createdHotels.length} hotels.`
    );

    console.log("\nHotels:");

    createdHotels.forEach((hotel) => {
      console.log(
        `✓ ${hotel.name} — ${hotel.location.city}`
      );
    });

    console.log("\nSeed completed successfully.");
  } catch (error) {
    console.error(
      "Hotel seed failed:",
      error
    );

    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedHotels();