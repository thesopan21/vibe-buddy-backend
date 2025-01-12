import { AudioCategoryTypes } from "@/utils/audioCategories";
import { ObjectId } from "mongoose";
import { RequestWithFile } from "./genericTypes";
import { Request } from "express";

export interface AudioFileType {
  url: string;
  publicId: string;
}

export interface AudioDocumentSchema {
  title: string;
  about: string;
  owner: ObjectId;
  file: AudioFileType;
  poster?: AudioFileType;
  likes: ObjectId[];
  categories: AudioCategoryTypes;
}

export interface AddNewAudioRequestBody extends RequestWithFile{
  body: {
    title: string;
    about: string;
    categories?: AudioCategoryTypes;
  };
}
