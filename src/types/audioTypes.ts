import { AudioCategoryTypes } from "@/utils/audioCategories";
import { ObjectId } from "mongoose";
import { RequestWithFile } from "./genericTypes";
import { Request } from "express";

export interface AudioFileType {
  url: string;
  publicId: string;
}

export interface AudioDocumentSchema <T=ObjectId>{
  title: string;
  about: string;
  owner: T;
  file: AudioFileType;
  poster?: AudioFileType;
  likes: ObjectId[];
  categories: AudioCategoryTypes;
}

interface Body {
  title: string;
  about: string;
  categories?: AudioCategoryTypes;
}

export interface AddNewAudioRequestBody extends RequestWithFile {
  body: Body;
}

export interface UpdateAudioRequestBody extends RequestWithFile {
  body: Body;
}
