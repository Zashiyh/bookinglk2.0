import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IDeal extends Document {
  hotelId: mongoose.Types.ObjectId;

  title: string;
  slug: string;
  description: string;

  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;

  originalPrice: number;
  dealPrice: number;

  currency: "LKR";

  startDate: Date;
  endDate: Date;

  maxBookings?: number;
  bookingsCount: number;

  promoCode?: string;
  image?: string;

  isFeatured: boolean;
  isPublished: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const DealSchema = new Schema<IDeal>(
  {
    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    title: {
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
      maxlength: 3000,
    },

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    originalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    dealPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    currency: {
      type: String,
      enum: ["LKR"],
      default: "LKR",
    },

    startDate: {
      type: Date,
      required: true,
      index: true,
    },

    endDate: {
      type: Date,
      required: true,
      index: true,
    },

    maxBookings: {
      type: Number,
      min: 1,
    },

    bookingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    promoCode: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: 50,
    },

    image: {
      type: String,
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
      index: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

DealSchema.index({
  hotelId: 1,
  isPublished: 1,
});

DealSchema.index({
  startDate: 1,
  endDate: 1,
});

DealSchema.index({
  isPublished: 1,
  isFeatured: 1,
});

const Deal: Model<IDeal> =
  mongoose.models.Deal ||
  mongoose.model<IDeal>("Deal", DealSchema);

export default Deal;
export { Deal };