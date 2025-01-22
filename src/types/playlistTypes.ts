import { Request } from "express";
import { ObjectId } from "mongoose";

export interface PlaylistDocument {
  title: string;
  owner: ObjectId;
  items: ObjectId[];
  visibility: "public" | "private" | "auto";
}

interface CreateBody {
  title: string;
  audioId: string;
  visibility: "public" | "private";
}

interface UpdateBody {
  title: string;
  id: string;
  itemId: string;
  visibility: "public" | "private";
}

export interface DeletePlaylistQuery {
  playlistId?: string;
  audioId?: string;
  all?: string;
}

export interface CreateNewPlaylistRequest extends Request {
  body: CreateBody;
}

export interface UpdateOldPlaylistRequestBody extends Request {
  body: UpdateBody;
}
