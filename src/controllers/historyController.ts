import { Request, Response } from "express";

export const getUserHistory = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.json({
      success: true,
    });
  } catch (error) {
    console.log("Error while getting history!");
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
