import { addNewAudioController } from "@/controllers/audioController";
import { isAuthUserController } from "@/controllers/userController";
import { isAuthorizedUserMiddleware, isVerifiedUserMiddleware } from "@/middlewares/authMiddleware";
import { parseFileMiddleware } from "@/middlewares/fileParserMiddleware";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { AudioSchemaValidations } from "@/validations/audioModelValidations";
import { Router } from "express";

const audioRoutes = Router();

audioRoutes.post(
  "/add-new-audio",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  parseFileMiddleware,
  schemaValidatorMiddleware(AudioSchemaValidations),
  addNewAudioController
);

export default audioRoutes;
