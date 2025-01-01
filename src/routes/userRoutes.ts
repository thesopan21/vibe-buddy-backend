import {
  creatNewUserController,
  greetingController,
} from "@/controllers/userController";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { CreateNewUserSchemaValidation } from "@/utils/userSchemaValidation";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", greetingController);
userRoutes.post(
  "/register",
  schemaValidatorMiddleware(CreateNewUserSchemaValidation),
  creatNewUserController
);

export default userRoutes;