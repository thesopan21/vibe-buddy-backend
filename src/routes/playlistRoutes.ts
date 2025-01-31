import {
  createPlaylistcontroller,
  deletePlaylistController,
  updatePlaylistController,
} from "@/controllers/playlistController";
import {
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
} from "@/middlewares/authMiddleware";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import {
  deletePlaylistSchema,
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

playlistRouter.delete(
  "/delete",
  isAuthorizedUserMiddleware,
  schemaValidatorMiddleware(deletePlaylistSchema),
  deletePlaylistController
);

export default playlistRouter;
