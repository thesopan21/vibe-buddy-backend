import { EmailVerificationTokenModelDocument } from "@/types/EmailVerificationTokenTypes";
import { Model, model, ObjectId, Schema } from "mongoose";

const emailVerificationTokenSchema =
  new Schema<EmailVerificationTokenModelDocument>(
    {
      woner: {
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
        default: Date.now()
      },
    },
    {
      timestamps: true,
    }
  );

const EmailVerificationTokenModel = model(
  "EmailVerificationToken",
  emailVerificationTokenSchema
) as Model<EmailVerificationTokenModelDocument>;
export default EmailVerificationTokenModel;
