import cloudinary from "@/config/cloudinary";
import AudioModel from "@/model/audioModel";
import {
  AddNewAudioRequestBody,
  UpdateAudioRequestBody,
} from "@/types/audioTypes";
import { Request, Response } from "express";

export const addNewAudioController = async (
  req: AddNewAudioRequestBody,
  res: Response
): Promise<void> => {
  try {
    const { title, about, categories } = req.body;
    const poster = req.files?.poster;
    const audioFile = req.files?.file;

    if (!audioFile) {
      res.status(422).json({
        message: "Audio file is missing!",
      });
      return;
    }

    const audioRes = await cloudinary.uploader.upload(audioFile.filepath, {
      resource_type: "video",
    });

    const newAudio = new AudioModel({
      title,
      about,
      categories,
      file: {
        url: audioRes.secure_url,
        publicId: audioRes.public_id,
      },
    });

    if (poster) {
      const posterRes = await cloudinary.uploader.upload(poster.filepath, {
        width: 400,
        height: 400,
        crop: "thumb",
        gravity: "face",
      });

      newAudio.poster = {
        url: posterRes.secure_url,
        publicId: posterRes.public_id,
      };
    }

    await newAudio.save();

    res.status(201).json({
      audio: {
        title,
        about,
        file: newAudio.file,
        poster: newAudio.poster,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const updateAudioController = async (
  req: UpdateAudioRequestBody,
  res: Response
): Promise<void> => {
  try {
    const { about, title, categories } = req.body;
    const { audioId } = req.params;
    const poster = req.files?.poster;
    const ownerId = req.user?.id;

    const audio = await AudioModel.findOneAndUpdate(
      {
        owner: ownerId,
        _id: audioId,
      },
      { title, about, categories },
      { new: true }
    );

    if (!audio) {
      res.status(404).json({
        message: "Audio not found!",
      });
      return;
    }

    if (poster) {
      if (audio.poster?.publicId) {
        await cloudinary.uploader.destroy(audio.poster.publicId);
      }

      const updatedPoster = await cloudinary.uploader.upload(poster.filepath, {
        width: 400,
        height: 400,
        gravity: "face",
        crop: "thumb",
      });

      audio.poster = {
        publicId: updatedPoster.public_id,
        url: updatedPoster.secure_url,
      };

      await audio.save();
    }

    res.status(200).json({
      message: "Audio updated successfully",
      updatedAudio: {
        title,
        about,
        file: audio.file.url,
        poster: audio.poster?.url,
      },
    });
  } catch (error) {
    console.log("Error while updating Audio:", error);
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
