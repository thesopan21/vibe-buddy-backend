import { isValidObjectId } from "mongoose";
import { object, string } from "yup";

const titleValidation = string()
  .required("Title is required!")
  .trim()
  .min(4, "title length must be greater than 4 character")
  .max(32, "Title length must be less than 32 character");

const idValidation = string().transform(function (value) {
  return this.isType(value) && isValidObjectId(value) ? value : "";
});

const visibilityValidation = string()
  .oneOf(["public", "private"], "invalid category")
  .required("Visibility is missing!");

export const newPlayListValidatonSchema = object().shape({
  title: titleValidation,
  audioId: idValidation,
  visibility: visibilityValidation,
});

export const oldPlaylistSchema = object().shape({
  title: titleValidation,
  id: idValidation,
  itemId: idValidation,
  visibility: visibilityValidation,
});
