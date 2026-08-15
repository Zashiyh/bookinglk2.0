import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export type VerificationPurpose =
  | "PASSWORD_CHANGE"
  | "EMAIL_CHANGE";

export interface IAccountVerification
  extends Document {
  userId: mongoose.Types.ObjectId;

  purpose: VerificationPurpose;

  email: string;

  otpHash: string;

  expiresAt: Date;

  attempts: number;

  verified: boolean;

  createdAt: Date;

  updatedAt: Date;
}

const AccountVerificationSchema =
  new Schema<IAccountVerification>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
      },

      purpose: {
        type: String,
        enum: [
          "PASSWORD_CHANGE",
          "EMAIL_CHANGE",
        ],
        required: true,
        index: true,
      },

      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
      },

      otpHash: {
        type: String,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        index: true,
      },

      attempts: {
        type: Number,
        default: 0,
      },

      verified: {
        type: Boolean,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

AccountVerificationSchema.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  }
);

const AccountVerification: Model<IAccountVerification> =
  mongoose.models.AccountVerification ||
  mongoose.model<IAccountVerification>(
    "AccountVerification",
    AccountVerificationSchema
  );

export default AccountVerification;