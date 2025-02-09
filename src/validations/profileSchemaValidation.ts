import { Request } from "express";

export interface updateFollowerReqBodyType extends Request {
  params: {
    profileId: string;
  };
}

export interface PublicAudiosType extends updateFollowerReqBodyType {}
