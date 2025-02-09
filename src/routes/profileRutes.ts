import {
  getPublicProfileInfo,
  getPublicUploadedAudios,
  getUploadedAudio,
  updateFollowers,
} from "@/controllers/profileController";
import { isAuthorizedUserMiddleware } from "@/middlewares/authMiddleware";
import { Router } from "express";

const profileRoutes = Router();

profileRoutes.patch(
  "/update-follower/:profileId",
  isAuthorizedUserMiddleware,
  updateFollowers
);

profileRoutes.get(
  "/uploaded-audios",
  isAuthorizedUserMiddleware,
  getUploadedAudio
);

profileRoutes.get("/uploaded-audios/:profileId", getPublicUploadedAudios);
profileRoutes.get("/info/:profileId", getPublicProfileInfo);

export default profileRoutes;
