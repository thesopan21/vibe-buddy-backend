import { AudioDocumentSchema } from "@/types/audioTypes";
import { categories } from "@/utils/audioCategories";
import { Model, model, models, Schema } from "mongoose";

const audioSchema = new Schema<AudioDocumentSchema>(
  {
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    file: {
      type: Object,
      url: String,
      publicId: String,
      required: true,
    },
    poster: {
      type: Object,
      url: String,
      publicId: String,
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    categories: {
      type: String,
      enum: categories,
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

const AudioModel = models.Audio || model("Audio", audioSchema);
export default AudioModel as Model<AudioDocumentSchema>;
