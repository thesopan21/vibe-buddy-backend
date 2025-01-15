import { FavoriteDocument } from "@/types/favoriteTypes";
import { Model, model, models, Schema } from "mongoose";

const favoriteSchema = new Schema<FavoriteDocument>(
  {
    owner: {
      required: true,
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const FavoriteModel = models.Favorite || model("Favorite", favoriteSchema);
export default FavoriteModel as Model<FavoriteDocument>;
