import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

/*
|--------------------------------------------------------------------------
| User Roles
|--------------------------------------------------------------------------
*/

export type UserRole =
  | "USER"
  | "HOTEL_OWNER"
  | "HOTEL_MANAGER"
  | "ADMIN"
  | "SUPER_ADMIN";

/*
|--------------------------------------------------------------------------
| User Interface
|--------------------------------------------------------------------------
*/

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;

  role: UserRole;

  avatar?: string | null;

  isActive: boolean;
  isEmailVerified: boolean;

  createdAt: Date;
  updatedAt: Date;
}

/*
|--------------------------------------------------------------------------
| User Schema
|--------------------------------------------------------------------------
*/

const UserSchema = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
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

    phone: {
      type: String,
      trim: true,
      default: "",
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

/*
|--------------------------------------------------------------------------
| Prevent model overwrite during Next.js hot reload
|--------------------------------------------------------------------------
*/

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>(
    "User",
    UserSchema
  );

/*

| Exports

*/

export { User };

export default User;