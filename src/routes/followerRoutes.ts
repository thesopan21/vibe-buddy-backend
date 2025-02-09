import { updateFollowers } from "@/controllers/followerController";
import { isAuthorizedUserMiddleware } from "@/middlewares/authMiddleware";
import { Router } from "express";

const profileRoutes = Router();

profileRoutes.patch(
  "/update-follower/:profileId",
  isAuthorizedUserMiddleware,
  updateFollowers
);


export default profileRoutes