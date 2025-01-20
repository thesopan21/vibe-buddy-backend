import { createPlaylistcontroller } from "@/controllers/playlistController";
import {
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
} from "@/middlewares/authMiddleware";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { newPlayListValidatonSchema } from "@/validations/playlistValidation";
import { Router } from "express";

const playlistRouter = Router();

playlistRouter.post(
  "/create",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  schemaValidatorMiddleware(newPlayListValidatonSchema),
  createPlaylistcontroller
);

export default playlistRouter;
