import {
  creatNewUserController,
  generateForgetPasswordUrl,
  greetingController,
  resetPassword,
  updatePassword,
  userSignInController,
  validateEmail,
} from "@/controllers/userController";
import {
  CreateNewUserRequestBodyValidation,
  EmailVerifiactionRequestBodyValidation,
  ResetPasswordRequestBodyValidations,
  SignInRequestBodyValidation,
  UpdatePasswordRequestBodyValidation,
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

userRoutes.post("/forget-password", generateForgetPasswordUrl);

userRoutes.post(
  "/verify-reset-password-token",
  schemaValidatorMiddleware(ResetPasswordRequestBodyValidations),
  isValidUserAndTokenMiddleware,
  resetPassword
);

userRoutes.post(
  "/update-password",
  schemaValidatorMiddleware(UpdatePasswordRequestBodyValidation),
  isValidUserAndTokenMiddleware,
  updatePassword
);

userRoutes.post(
  "/sign-in",
  schemaValidatorMiddleware(SignInRequestBodyValidation),
  userSignInController
);

export default userRoutes;
