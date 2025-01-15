import { toggleFavoriteAudio } from "@/controllers/favoriteController";
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

export default favoriteRoutes;
