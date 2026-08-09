import "dotenv/config";
import mongoose from "mongoose";

import { Hotel } from "../models/Hotel";
import { Room } from "../models/Room";

async function seedRooms() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      throw new Error(
        "MONGODB_URI is missing. Check your .env.local file."
      );
    }

    await mongoose.connect(MONGODB_URI);

    console.log("✓ MongoDB connected");

    const hotels = await Hotel.find({
      isPublished: true,
    }).select("_id name slug");

    if (hotels.length === 0) {
      console.log("No published hotels found.");
      return;
    }

    await Room.deleteMany({});

    const rooms = [];

    for (const hotel of hotels) {
      rooms.push(
        {
          hotelId: hotel._id,
          name: "Deluxe King Room",
          description:
            "A comfortable and elegant room with a king-size bed, modern facilities and a relaxing atmosphere.",
          roomType: "DELUXE",
          pricePerNight: 25000,
          currency: "LKR",
          maxGuests: 2,

          beds: [
            {
              type: "KING",
              count: 1,
            },
          ],

          size: 32,

          amenities: [
            "Free WiFi",
            "Air Conditioning",
            "Private Bathroom",
            "TV",
            "Breakfast Available",
          ],

          images: [],

          totalRooms: 5,
          isActive: true,
        },

        {
          hotelId: hotel._id,
          name: "Premium Family Room",
          description:
            "Spacious family accommodation designed for comfortable stays with extra sleeping space.",
          roomType: "FAMILY",
          pricePerNight: 38000,
          currency: "LKR",
          maxGuests: 4,

          beds: [
            {
              type: "QUEEN",
              count: 2,
            },
          ],

          size: 48,

          amenities: [
            "Free WiFi",
            "Air Conditioning",
            "Private Bathroom",
            "TV",
            "Breakfast Available",
            "Parking",
          ],

          images: [],

          totalRooms: 3,
          isActive: true,
        },

        {
          hotelId: hotel._id,
          name: "Luxury Suite",
          description:
            "A premium suite offering extra space, elegant interiors and enhanced comfort.",
          roomType: "SUITE",
          pricePerNight: 55000,
          currency: "LKR",
          maxGuests: 3,

          beds: [
            {
              type: "KING",
              count: 1,
            },
            {
              type: "SINGLE",
              count: 1,
            },
          ],

          size: 65,

          amenities: [
            "Free WiFi",
            "Air Conditioning",
            "Private Bathroom",
            "Smart TV",
            "Breakfast",
            "Mini Bar",
            "Room Service",
          ],

          images: [],

          totalRooms: 2,
          isActive: true,
        }
      );
    }

    await Room.insertMany(rooms);

    console.log(`✓ Added ${rooms.length} rooms`);

    for (const hotel of hotels) {
      console.log(`✓ Rooms added → ${hotel.name}`);
    }
  } catch (error) {
    console.error("Room seed error:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedRooms();