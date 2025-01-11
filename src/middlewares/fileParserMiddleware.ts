import { NextFunction, Request, Response } from "express";
import formidable, { File } from "formidable";

export interface RequestWithFile extends Request {
  files?: {
    [key: string]: File;
  };
}

export const parseFileMiddleware = async (
  req: RequestWithFile,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Validate Content-Type header
    if (!req.headers["content-type"]?.includes("multipart/form-data")) {
      res.status(422).json({
        message: "Only multipart/form-data is accepted.",
      });
      return;
    }

    const fileData = formidable({ multiples: false });
    const [fields, files] = await fileData.parse(req);

    for (let key in fields) {
      const field = fields[key];
      if (field) {
        req.body[key] = field[0];
      }
    }

    for (let key in files) {
      const file = files[key];
      if (!req.files) {
        req.files = {};
      }
      if (file) {
        req.files[key] = file[0];
      }
    }

    next();
  } catch (error) {
    console.log("file parse middleware error!");
    res.status(422).json({
      message: "unable to upload file",
    });
  }
};
