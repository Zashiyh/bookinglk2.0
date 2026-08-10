
import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "COMPLETED";

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED";

export interface IBooking extends Document {
  bookingReference: string;

  hotelId: mongoose.Types.ObjectId;
  roomId: mongoose.Types.ObjectId;

  checkIn: Date;
  checkOut: Date;

  guests: number;

  guest: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };

  specialRequest?: string;

  nights: number;
  roomPrice: number;
  roomTotal: number;
  serviceFee: number;
  total: number;

  currency: "LKR";

  status: BookingStatus;
  paymentStatus: PaymentStatus;

  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },

    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    roomId: {
      type: Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    checkIn: {
      type: Date,
      required: true,
      index: true,
    },

    checkOut: {
      type: Date,
      required: true,
      index: true,
    },

    guests: {
      type: Number,
      required: true,
      min: 1,
    },

    guest: {
      firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 100,
      },

      email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        maxlength: 200,
      },

      phone: {
        type: String,
        required: true,
        trim: true,
        maxlength: 30,
      },
    },

    specialRequest: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: "",
    },

    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    roomPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    roomTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    serviceFee: {
      type: Number,
      required: true,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["LKR"],
      default: "LKR",
    },

    status: {
      type: String,
      enum: [
        "PENDING",
        "CONFIRMED",
        "CANCELLED",
        "COMPLETED",
      ],
      default: "PENDING",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: [
        "PENDING",
        "PAID",
        "FAILED",
        "REFUNDED",
      ],
      default: "PENDING",
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

/*
 * Booking search / availability index
 */
BookingSchema.index({
  hotelId: 1,
  roomId: 1,
  checkIn: 1,
  checkOut: 1,
});

/*
 * Useful indexes for admin dashboard
 */
BookingSchema.index({
  status: 1,
  createdAt: -1,
});

BookingSchema.index({
  paymentStatus: 1,
  createdAt: -1,
});

/*
 * Prevent model recompilation during
 * Next.js development hot reloads.
 */
export const Booking: Model<IBooking> =
  mongoose.models.Booking ||
  mongoose.model<IBooking>(
    "Booking",
    BookingSchema
  );

/*
 * Default export
 *
 * Supports:
 * import Booking from "@/models/Booking";
 */
export default Booking;
