import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

/* =========================================================
   TYPES
========================================================= */

export type RoomType =
  | "STANDARD"
  | "DELUXE"
  | "SUITE"
  | "FAMILY"
  | "VILLA";

export type BedType =
  | "SINGLE"
  | "DOUBLE"
  | "QUEEN"
  | "KING"
  | "TWIN";

export interface IRoomBed {
  type: BedType;
  count: number;
}

export interface IRoom extends Document {
  hotelId: mongoose.Types.ObjectId;

  name: string;
  description: string;

  roomType: RoomType;

  pricePerNight: number;
  currency: "LKR";

  maxGuests: number;

  beds: IRoomBed[];

  size?: number;

  amenities: string[];

  images: string[];

  totalRooms: number;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/* =========================================================
   BED SCHEMA
========================================================= */

const BedSchema = new Schema<IRoomBed>(
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
  {
    _id: false,
  }
);

/* =========================================================
   ROOM SCHEMA
========================================================= */

const RoomSchema = new Schema<IRoom>(
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
      trim: true,
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

    beds: {
      type: [BedSchema],
      required: true,
      default: [],
    },

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

/* =========================================================
   INDEXES
========================================================= */

RoomSchema.index({
  hotelId: 1,
  isActive: 1,
});

RoomSchema.index({
  hotelId: 1,
  pricePerNight: 1,
});

RoomSchema.index({
  hotelId: 1,
  roomType: 1,
});

/* =========================================================
   MODEL
========================================================= */

export const Room: Model<IRoom> =
  mongoose.models.Room ||
  mongoose.model<IRoom>(
    "Room",
    RoomSchema
  );