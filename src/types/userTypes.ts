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

interface CreateUserRequestBody {
  name: string;
  email: string;
  password: string;
}

export interface CreateNewUserRequestBody extends Request {
  body: CreateUserRequestBody;
}

export interface Methods {
  validatePassword(password: string): Promise<boolean>;
}

export interface ValidateEmailRequestBody {
  userId: string;
  otpToken: string;
}

export interface ReverificationTokenRequestBody {
  userId: string;
}
