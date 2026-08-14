import mongoose, {
  Schema,
  Document,
  Model,
} from "mongoose";

export interface IEmailVerification
  extends Document {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone?: string;
  code: string;
  expiresAt: Date;
  attempts: number;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema =
  new Schema<IEmailVerification>(
    {
      email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true,
      },

      firstName: {
        type: String,
        required: true,
        trim: true,
      },

      lastName: {
        type: String,
        required: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        default: "",
        trim: true,
      },

      code: {
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
    },
    {
      timestamps: true,
    }
  );

/*
 * Automatically remove expired verification records.
 */
EmailVerificationSchema.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 }
);

const EmailVerification: Model<IEmailVerification> =
  mongoose.models.EmailVerification ||
  mongoose.model<IEmailVerification>(
    "EmailVerification",
    EmailVerificationSchema
  );

export {
  EmailVerification,
};

export default EmailVerification;