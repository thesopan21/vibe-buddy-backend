import { categories } from "@/utils/audioCategories";
import { number, object, string } from "yup";

const titleValidation = string()
  .required("Title is required!")
  .trim()
  .min(4, "title length must be greater than 4 character")
  .max(32, "Title length must be less than 32 character");

const aboutValidation = string().trim().required("Title is required!");

const categoryValidation = string().oneOf(categories, "Invalid category!");

const filesValidation = string();

const likesValidation = number();

const ownerValidation = Object();

export const AudioSchemaValidations = object().shape({
  title: titleValidation,
  about: aboutValidation,
  categories: categoryValidation,
  file: filesValidation,
  poster: filesValidation,
  likes: likesValidation,
  owner: ownerValidation,
});
