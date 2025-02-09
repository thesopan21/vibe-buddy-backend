import { updateFollowers } from "@/controllers/followerController";
import { isAuthorizedUserMiddleware } from "@/middlewares/authMiddleware";
import { Router } from "express";

const followerRoutes = Router();

followerRoutes.post(
  "/update-follower/:userId",
  isAuthorizedUserMiddleware,
  updateFollowers
);


export default followerRoutes