import { Request } from "express";
import { ObjectId } from "mongoose";

export interface PlaylistDocument {
  title: string;
  owner: ObjectId;
  items: ObjectId[];
  visibility: "public" | "private" | "auto";
}

interface RequestBody {
  title: string;
  audioId: string;
  visibility: "public" | "private";
}

export interface CreateNewPlaylistRequest extends Request {
  body: RequestBody;
}
