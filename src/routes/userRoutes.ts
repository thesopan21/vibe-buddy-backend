import {
  creatNewUserController,
  generateForgetPasswordUrl,
  greetingController,
  resetPassword,
  validateEmail,
} from "@/controllers/userController";
import {
  CreateNewUserRequestBodyValidation,
  EmailVerifiactionRequestBodyValidation,
  ResetPasswordRequestBodyValidations,
} from "@/utils/userSchemaValidation";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { Router } from "express";
import { isValidUserAndTokenMiddleware } from "@/middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.get("/", greetingController);

userRoutes.post(
  "/register",
  schemaValidatorMiddleware(CreateNewUserRequestBodyValidation),
  creatNewUserController
);

userRoutes.post(
  "/verify-email",
  schemaValidatorMiddleware(EmailVerifiactionRequestBodyValidation),
  validateEmail
);

userRoutes.post("/reset-password", generateForgetPasswordUrl);

userRoutes.post(
  "/verify-reset-password-token",
  schemaValidatorMiddleware(ResetPasswordRequestBodyValidations),
  isValidUserAndTokenMiddleware,
  resetPassword
);

export default userRoutes;
