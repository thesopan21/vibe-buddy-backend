import {
  creatNewUserController,
  generateForgetPasswordUrl,
  greetingController,
  isAuthUserController,
  resetPassword,
  updatePassword,
  uploadUserProfilePicture,
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
import {
  isAuthorizedUserMiddleware,
  isValidUserAndTokenMiddleware,
} from "@/middlewares/authMiddleware";
import { parseFileMiddleware } from "@/middlewares/fileParserMiddleware";

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

userRoutes.get(
  "/is-authorized",
  isAuthorizedUserMiddleware,
  isAuthUserController
);

userRoutes.post(
  "/update-profile-pic",
  isAuthorizedUserMiddleware,
  parseFileMiddleware,
  uploadUserProfilePicture
);

export default userRoutes;
