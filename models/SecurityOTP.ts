import mongoose, {
  Document,
  Model,
  Schema,
  Types,
} from "mongoose";

export type SecurityOTPPurpose =
  | "CHANGE_PASSWORD"
  | "CHANGE_EMAIL";

export interface ISecurityOTP extends Document {
  userId: Types.ObjectId;
  email: string;
  otpHash: string;
  purpose: SecurityOTPPurpose;
  expiresAt: Date;
  attempts: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SecurityOTPSchema =
  new Schema<ISecurityOTP>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      otpHash: {
        type: String,
        required: true,
      },

      purpose: {
        type: String,
        enum: [
          "CHANGE_PASSWORD",
          "CHANGE_EMAIL",
        ],
        required: true,
        index: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      attempts: {
        type: Number,
        default: 0,
        min: 0,
      },

      verified: {
        type: Boolean,
        default: false,
        index: true,
      },
    },
    {
      timestamps: true,
    }
  );

/*
|--------------------------------------------------------------------------
| TTL INDEX
|--------------------------------------------------------------------------
|
| MongoDB automatically deletes expired OTP records.
|
*/

SecurityOTPSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

/*
|--------------------------------------------------------------------------
| QUERY INDEX
|--------------------------------------------------------------------------
*/

SecurityOTPSchema.index({
  userId: 1,
  purpose: 1,
  createdAt: -1,
});

/*
|--------------------------------------------------------------------------
| MODEL
|--------------------------------------------------------------------------
*/

const SecurityOTP: Model<ISecurityOTP> =
  mongoose.models.SecurityOTP ||
  mongoose.model<ISecurityOTP>(
    "SecurityOTP",
    SecurityOTPSchema
  );

export default SecurityOTP;
export { SecurityOTP };