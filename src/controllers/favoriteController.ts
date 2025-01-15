import { Request, Response } from "express";

export const toggleFavoriteAudio = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      message: "Audio added as a favorite succefully!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
