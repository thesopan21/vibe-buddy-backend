import { Request, Response } from "express";

export const updateFollowers = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {} = req.params;
    res.json({
      flag: true,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error!",
    });
  }
};
