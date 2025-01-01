import { ObjectId } from "mongoose";

export interface EmailVerificationTokenModelDocument {
  woner: ObjectId;
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
