import {
  createPlaylistcontroller,
  updatePlaylistController,
} from "@/controllers/playlistController";
import {
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
} from "@/middlewares/authMiddleware";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import {
  newPlayListValidatonSchema,
  oldPlaylistSchema,
} from "@/validations/playlistValidation";
import { Router } from "express";

const playlistRouter = Router();

playlistRouter.post(
  "/create",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  schemaValidatorMiddleware(newPlayListValidatonSchema),
  createPlaylistcontroller
);

playlistRouter.patch(
  "/update",
  isAuthorizedUserMiddleware,
  schemaValidatorMiddleware(oldPlaylistSchema),
  updatePlaylistController
);

export default playlistRouter;
