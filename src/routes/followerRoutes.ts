import { updateFollowers } from "@/controllers/followerController";
import { isAuthorizedUserMiddleware } from "@/middlewares/authMiddleware";
import { Router } from "express";

const followerRoutes = Router();

followerRoutes.patch(
  "/update-follower/:profileId",
  isAuthorizedUserMiddleware,
  updateFollowers
);


export default followerRoutes