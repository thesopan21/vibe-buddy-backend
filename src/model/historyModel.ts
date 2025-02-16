import { HistoryDocumentType } from "@/types/historyTypes";
import { Model, model, models, Schema } from "mongoose";

const historySchema = new Schema<HistoryDocumentType>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    last: {
      audio: {
        type: Schema.Types.ObjectId,
        ref: "Audio",
      },
      progress: Number,
      date: {
        type: Date,
        required: true,
      },
    },
    all: [
      {
        audio: {
          type: Schema.Types.ObjectId,
          ref: "Audio",
        },
        progress: Number,
        date: {
          type: Date,
          required: true,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


const HistoryModel = models.History || model('History', historySchema)
export default HistoryModel as Model<HistoryDocumentType>
