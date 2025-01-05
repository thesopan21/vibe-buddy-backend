import {
  ResetPasswordDocument,
  ResetPasswordSchemaMethods,
} from "@/types/resetPasswordTypes";
import { compare, hash } from "bcrypt";
import { Model, model, Schema } from "mongoose";

export const resetPasswordSchema = new Schema<
  ResetPasswordDocument,
  {},
  ResetPasswordSchemaMethods
>({
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
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
});

resetPasswordSchema.pre("save", async function (next) {
  // hash token
  if (this.isModified("token")) {
    this.token = await hash(this.token, 10);
  }

  next();
});

resetPasswordSchema.methods.compairePassword = async function (token) {
  const result = await compare(token, this.token);
  return result;
};

const ResetPasswordModel = model("ResetPassword", resetPasswordSchema) as Model<
  ResetPasswordDocument,
  {},
  ResetPasswordSchemaMethods
>;
export default ResetPasswordModel;
