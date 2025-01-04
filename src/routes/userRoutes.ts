import {
  creatNewUserController,
  greetingController,
  validateEmail,
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
userRoutes.post('/verify-email', validateEmail)

export default userRoutes;