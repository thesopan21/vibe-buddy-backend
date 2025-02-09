import { Request } from "express";

export interface updateFollowerReqBodyType extends Request {
  params: {
    profileId: string;
  };
}
