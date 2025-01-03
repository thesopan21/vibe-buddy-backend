import { Methods, UserDocument } from "@/types/userTypes";
import { compare, hash } from "bcrypt";
import { Model, model, Schema } from "mongoose";

const userSchema = new Schema<UserDocument, {}, Methods>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    avatars: {
      type: String,
      url: String,
      publicId: String,
    },
    tokens: [String],
    favorites: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // hash password 
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }

  next();
});

userSchema.methods.validatePassword = async function (password) {
  const isValidPassword = await compare(password, this.password);
  return isValidPassword;
};

const UserModel = model("User", userSchema) as Model<UserDocument, {}, Methods>;
export default UserModel;
