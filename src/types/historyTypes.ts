import { ObjectId } from "mongoose";

type HistoryType = {
  audio: ObjectId;
  progress: number;
  date: Date;
};

export interface HistoryDocumentType {
  owner: ObjectId;
  last: HistoryType;
  all: HistoryType[];
}
