import AudioModel from "@/model/audioModel";
import PlayListModel from "@/model/playlistModel";
import {
  CreateNewPlaylistRequest,
  DeletePlaylistQuery,
  UpdateOldPlaylistRequestBody,
} from "@/types/playlistTypes";
import { Request, Response } from "express";
import { isValidObjectId, Types } from "mongoose";

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
      newPlaylist.items = [audioId as any];
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

export const updatePlaylistController = async (
  req: UpdateOldPlaylistRequestBody,
  res: Response
): Promise<void> => {
  try {
    const { id, itemId, title, visibility } = req.body;
    const ownerId = req.user?.id;

    const playlist = await PlayListModel.findOneAndUpdate(
      {
        _id: id,
        owner: ownerId,
      },
      {
        title,
        visibility,
      },
      {
        new: true,
      }
    );

    if (!playlist) {
      res.status(404).json({
        message: "Playlist not found!",
      });
      return;
    }

    if (itemId) {
      const audio = await AudioModel.findById(itemId);
      if (!audio) {
        res.status(404).json({
          message: "Audio not found!",
        });
        return;
      }

      // playlist.items.push(itemId as any);
      // await playlist.save();
      await PlayListModel.findByIdAndUpdate(playlist._id, {
        $addToSet: { items: itemId },
      });
    }

    res.status(200).json({
      playlist: {
        id: playlist._id,
        title: playlist.title,
        items: playlist.items,
        visibility: playlist.visibility,
      },
    });
  } catch (error) {
    console.log("Error while updating playlist:", error);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};

export const deletePlaylistController = async (
  req: Request<
    any, // Params (if you don't have any params, use `any` or an empty object `{}`)
    any, // ResBody
    any, // ReqBody
    DeletePlaylistQuery // ReqQuery (your custom query type)
  >,
  res: Response
): Promise<void> => {
  try {
    const { all, audioId, playlistId } = req.query;
    const ownerId = req.user?.id;

    if (!playlistId || !isValidObjectId(playlistId)) {
      res.status(422).json({
        message: "Invalid playlist id!",
      });
    }

    if (all === "yes") {
      const deletedPlaylist = await PlayListModel.findOneAndDelete({
        _id: playlistId,
        owner: ownerId,
      });
      if (!deletedPlaylist) {
        res.status(404).json({
          message: "Playlist not found!",
        });
        return;
      }

      res.status(200).json({
        message: "Playlist deleted successfully!",
        success: true,
      });
      return;
    }

    if (!audioId || !isValidObjectId(audioId)) {
      res.status(422).json({
        message: "Invalid audio id!",
      });
    }

    const removeSingleAudio = await PlayListModel.findOneAndUpdate(
      {
        _id: playlistId,
        owner: ownerId,
      },
      {
        $pull: { items: audioId },
      }
    );

    if (!removeSingleAudio) {
      res.status(404).json({
        message: "Audio not found!",
      });
      return;
    }

    res.status(200).json({
      message: "Audio deleted successfully!",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
