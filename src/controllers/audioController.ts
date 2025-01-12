import cloudinary from "@/config/cloudinary";
import AudioModel from "@/model/audioModel";
import { AddNewAudioRequestBody } from "@/types/audioTypes";
import { Request, Response } from "express";

export const addNewAudioController = async (
  req: AddNewAudioRequestBody,
  res: Response
): Promise<void> => {
  try {
    const { title, about, categories } = req.body;
    const poster = req.files?.poster;
    const audioFile = req.files?.file;
    const ownerId = req.user?.id;

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
