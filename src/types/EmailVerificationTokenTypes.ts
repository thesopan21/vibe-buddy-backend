import { ObjectId } from "mongoose";

export interface EmailVerificationTokenModelDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
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

export interface ResetPasswordOptions {
  email: string;
  passwordResetUrl: string;
  userName: string;
}

export interface UpdatePasswordUserProfile {
  email: string;
  userName: string;
}
