import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export interface IReview extends Document {
  userId: Types.ObjectId;
  hotelId: Types.ObjectId;
  bookingId?: Types.ObjectId;

  rating: number;
  title?: string;
  comment: string;

  userName: string;

  isPublished: boolean;
  isVerifiedStay: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    hotelId: {
      type: Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      index: true,
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    title: {
      type: String,
      trim: true,
      maxlength: 120,
      default: "",
    },

    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 2000,
    },

    userName: {
      type: String,
      required: true,
      trim: true,
    },

    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },

    isVerifiedStay: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({
  hotelId: 1,
  createdAt: -1,
});

ReviewSchema.index(
  {
    userId: 1,
    hotelId: 1,
  },
  {
    unique: true,
  }
);

const Review: Model<IReview> =
  mongoose.models.Review ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;