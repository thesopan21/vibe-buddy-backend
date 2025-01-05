import { ObjectId } from "mongoose";

export interface ResetPasswordDocument {
  owner: ObjectId;
  token: string;
  createdAt: Date;
}

export interface ResetPasswordSchemaMethods {
  compairePassword(password: string): Promise<Boolean>;
}

export interface ResetPasswordRequestBody {
  email: String;
}
