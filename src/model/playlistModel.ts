import { PlaylistDocument } from "@/types/playlistTypes";
import { Model, model, models, Schema } from "mongoose";

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
