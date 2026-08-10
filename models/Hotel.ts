
import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IHotel extends Document {
  name: string;
  slug: string;
  description: string;

  propertyType:
    | "HOTEL"
    | "RESORT"
    | "VILLA"
    | "APARTMENT"
    | "GUEST_HOUSE"
    | "BOUTIQUE_HOTEL"
    | "HOSTEL"
    | "HOMESTAY";

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

  ownerId: mongoose.Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}

const HotelSchema = new Schema<IHotel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },

    propertyType: {
      type: String,
      enum: [
        "HOTEL",
        "RESORT",
        "VILLA",
        "APARTMENT",
        "GUEST_HOUSE",
        "BOUTIQUE_HOTEL",
        "HOSTEL",
        "HOMESTAY",
      ],
      required: true,
      index: true,
    },

    location: {
      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      district: {
        type: String,
        required: true,
        trim: true,
        index: true,
      },

      province: {
        type: String,
        required: true,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        default: "Sri Lanka",
      },
    },

    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
        default: "Point",
      },

      coordinates: {
        type: [Number],
        required: true,

        validate: {
          validator: (value: number[]) => {
            return (
              Array.isArray(value) &&
              value.length === 2 &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },

          message:
            "Coordinates must be [longitude, latitude]",
        },
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      index: true,
    },

    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    priceFrom: {
      type: Number,
      required: true,
      min: 0,
      index: true,
    },

    currency: {
      type: String,
      enum: ["LKR"],
      default: "LKR",
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Geospatial index
 *
 * Used for:
 * - Hotels near me
 * - Hotels within a specific radius
 * - Location-based hotel search
 */
HotelSchema.index({
  coordinates: "2dsphere",
});

/*
 * Common hotel search index
 */
HotelSchema.index({
  "location.city": 1,
  propertyType: 1,
  priceFrom: 1,
  rating: -1,
});

/*
 * Prevent model recompilation during
 * Next.js development hot reloads.
 */
export const Hotel: Model<IHotel> =
  mongoose.models.Hotel ||
  mongoose.model<IHotel>("Hotel", HotelSchema);

export default Hotel;

