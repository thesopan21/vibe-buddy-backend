import { AudioCategoryTypes } from "@/utils/audioCategories";
import { ObjectId } from "mongoose";

export interface AudioDocumentSchema {
  title: string;
  about: string;
  owner: ObjectId;
  file: {
    url: string;
    publicId: string;
  };
  poster?: {
    url: string;
    publicId: string;
  };
  likes: ObjectId[];
  categgories: AudioCategoryTypes;
}
