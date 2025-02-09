import { Request } from "express";
import { File } from "formidable";

export interface RequestWithFile extends Request {
  files?: {
    [key: string]: File;
  };
}

export interface PaginationQueryParams {
  pageNumber: string;
  pageSize: string;
}
