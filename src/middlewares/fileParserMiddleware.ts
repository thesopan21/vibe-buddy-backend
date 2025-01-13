import { Request, Response, NextFunction } from "express";
import formidable, { File } from "formidable";

export interface RequestWithFiles extends Request {
  body: any;
  files?: Record<string, File>;
}

export const fileParseMiddleware = async (
  req: RequestWithFiles,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const contentType = req.headers["content-type"];

    if (!contentType || !contentType.startsWith("multipart/form-data")) {
      res.status(422).json({
        message: "Only multipart/form-data is accepted.",
      });
      return;
    }
    const formData = formidable({ multiples: false });
    const [fields, files] = await formData.parse(req);

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
    console.log("error while uploading file!", error);
    res.status(422).json({
      message: "unable to upload file",
    });
  }
};
