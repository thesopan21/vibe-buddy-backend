import { Request, Response } from "express";

export const addNewAudioController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.json({
      message: "new audio added successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};
