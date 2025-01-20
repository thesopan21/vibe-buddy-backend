import { Model, model, models, ObjectId, Schema } from "mongoose";

export interface PlaylistDocument {
  title: string;
  owner: ObjectId;
  items: ObjectId[];
  visibility: "public" | "private" | "auto";
}

const playListSchema = new Schema<PlaylistDocument>(
  {
    title: {
      type: String,
      required: true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
        require: true,
      },
    ],
    owner: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        require: true,
      },
    ],
    visibility: {
      type: String,
      enum: ["public", "private", "auto"],
      default: "public",
    },
  },
  {
    timestamps: true,
  }
);

const PlayListModel = models.Playlist || model("Playlist", playListSchema);
export default PlayListModel as Model<PlaylistDocument>;
