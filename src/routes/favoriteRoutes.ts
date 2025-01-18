import {
  getFavoriteAudioController,
  getIsFavoriteAudioController,
  toggleFavoriteAudio,
} from "@/controllers/favoriteController";
import {
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
} from "@/middlewares/authMiddleware";
import { Router } from "express";

const favoriteRoutes = Router();

favoriteRoutes.post(
  "/",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  toggleFavoriteAudio
);

favoriteRoutes.get(
  "/",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  getFavoriteAudioController
);

favoriteRoutes.get(
  "/is-favorites",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  getIsFavoriteAudioController
);

export default favoriteRoutes;
