import {
  creatNewUserController,
  generateForgetPasswordUrl,
  greetingController,
  validateEmail,
} from "@/controllers/userController";
import {
  CreateNewUserSchemaValidation,
  EmailVerifiactionRequestBodyValidation,
} from "@/utils/userSchemaValidation";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { Router } from "express";

const userRoutes = Router();

userRoutes.get("/", greetingController);

userRoutes.post(
  "/register",
  schemaValidatorMiddleware(CreateNewUserSchemaValidation),
  creatNewUserController
);

userRoutes.post(
  "/verify-email",
  schemaValidatorMiddleware(EmailVerifiactionRequestBodyValidation),
  validateEmail
);

userRoutes.post("/reset-password", generateForgetPasswordUrl);

export default userRoutes;
