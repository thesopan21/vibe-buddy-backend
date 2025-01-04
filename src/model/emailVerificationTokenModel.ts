import {
  EmailVerificationTokenModelDocument,
  Methods,
} from "@/types/EmailVerificationTokenTypes";
import { compare, hash } from "bcrypt";
import { Model, model, ObjectId, Schema } from "mongoose";
import { boolean } from "yup";

const emailVerificationTokenSchema = new Schema<
  EmailVerificationTokenModelDocument,
  {},
  Methods
>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      expires: 600,
      default: Date.now(),
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

// hash otp token before saving into db
emailVerificationTokenSchema.pre("save", async function (next) {
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }
  next();
});

// add compareToken method
emailVerificationTokenSchema.methods.compareToken = async function (otpToken) {
  const isValidToken = await compare(otpToken, this.token);
  return isValidToken;
};

const EmailVerificationTokenModel = model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenModelDocument, {}, Methods>;

export default EmailVerificationTokenModel;
