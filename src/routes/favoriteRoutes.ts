import {
  getFavoriteAudioController,
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

export default favoriteRoutes;
