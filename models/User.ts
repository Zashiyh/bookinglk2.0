import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type UserRole =
  | "USER"
  | "HOTEL_OWNER"
  | "HOTEL_MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  role: UserRole;

  avatar?: string;

  isActive: boolean;
  isEmailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: [
        "USER",
        "HOTEL_OWNER",
        "HOTEL_MANAGER",
        "ADMIN",
        "SUPER_ADMIN",
      ],
      default: "USER",
      index: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);