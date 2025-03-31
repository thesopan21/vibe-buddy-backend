import { getUserHistory } from "@/controllers/historyController";
import { isAuthorizedUserMiddleware } from "@/middlewares/authMiddleware";
import { Router } from "express";

const historyRoutes = Router();

historyRoutes.get("/", isAuthorizedUserMiddleware, getUserHistory);


export default historyRoutes;