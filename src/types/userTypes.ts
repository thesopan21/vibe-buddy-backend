import { ObjectId } from "mongoose";


export interface UserDocument {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  avatars?: {
    url: string;
    publicId: string;
  };
  tokens: string[];
  favorites: ObjectId[];
  followers: ObjectId[];
  followings: ObjectId[];
}
