import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IRoom extends Document {
  hotelId: mongoose.Types.ObjectId;

  name: string;
  description: string;

  roomType:
    | "STANDARD"
    | "DELUXE"
    | "SUITE"
    | "FAMILY"
    | "VILLA";

  pricePerNight: number;
  currency: "LKR";

  maxGuests: number;

  beds: {
    type:
      | "SINGLE"
      | "DOUBLE"
      | "QUEEN"
      | "KING"
      | "TWIN";
    count: number;
  }[];

  size?: number;

  amenities: string[];

  images: string[];

  totalRooms: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const RoomSchema = new Schema(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    roomType: {
      type: String,
      enum: [
        "STANDARD",
        "DELUXE",
        "SUITE",
        "FAMILY",
        "VILLA",
      ],
      required: true,
      index: true,
    },

    pricePerNight: {
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

    maxGuests: {
      type: Number,
      required: true,
      min: 1,
      max: 20,
    },

    beds: [
      {
        type: {
          type: String,
          enum: [
            "SINGLE",
            "DOUBLE",
            "QUEEN",
            "KING",
            "TWIN",
          ],
          required: true,
        },

        count: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],

    size: {
      type: Number,
      min: 1,
    },

    amenities: {
      type: [String],
      default: [],
    },

    images: {
      type: [String],
      default: [],
    },

    totalRooms: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

RoomSchema.index({
  hotelId: 1,
  isActive: 1,
});

RoomSchema.index({
  hotelId: 1,
  pricePerNight: 1,
});

export const Room: Model<IRoom> =
  mongoose.models.Room ||
  mongoose.model<IRoom>("Room", RoomSchema);