import AudioModel from "@/model/audioModel";
import PlayListModel from "@/model/playlistModel";
import { CreateNewPlaylistRequest } from "@/types/playlistTypes";
import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

export const createPlaylistcontroller = async (
  req: CreateNewPlaylistRequest,
  res: Response
): Promise<void> => {
  try {
    const { audioId, title, visibility } = req.body;
    const ownerId = req.user?.id;

    if (audioId) {
      const audio = await AudioModel.findById(audioId);
      if (!audio) {
        res.status(404).json({
          message: "could not found the audio!",
        });
        return;
      }
    }

    const newPlaylist = new PlayListModel({
      title,
      owner: ownerId,
      visibility,
    });

    if (audioId) {
      newPlaylist.items = [new mongoose.Types.ObjectId(ownerId),];
    }

    await newPlaylist.save();

    res.status(201).json({
      message: "playlist created successfully!",
      playlist: {
        id: newPlaylist._id,
        title: newPlaylist.title,
        visibility: newPlaylist.visibility,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
