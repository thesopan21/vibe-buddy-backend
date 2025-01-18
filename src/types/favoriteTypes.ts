import { ObjectId } from "mongoose";

export interface FavoriteDocument {
  owner: ObjectId;
  items: ObjectId[];
}

export interface OwnerObject {
  _id: ObjectId;
  name: string;
}

export interface FileObject {
  url: string;
  publicId: string;
}

export interface PopulateFavoriteList {
  _id: ObjectId;
  title: string;
  categories: string;
  file: FileObject;
  poster: FileObject;
  owner: OwnerObject;
}
