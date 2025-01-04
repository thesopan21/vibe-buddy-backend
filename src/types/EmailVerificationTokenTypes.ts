import { ObjectId } from "mongoose";

export interface EmailVerificationTokenModelDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
  isEmailVerified?:boolean
}

export interface Methods {
  compareToken(token: string): Promise<boolean>;
}

export interface TemplateDetails {
  title: string;
  message: string;
  link: string;
  logo: string;
  banner: string;
  btnTitle: string;
}

export interface UserProfile {
  otpToken: string;
  userName: string;
  email: string;
  userId: string;
}
