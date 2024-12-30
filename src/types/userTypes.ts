import { Request } from "express";
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

interface RequestBody {
  name: string;
  email: string;
  password: string;
}

export interface CreateNewUserRequestBody extends Request {
  body: RequestBody;
}
