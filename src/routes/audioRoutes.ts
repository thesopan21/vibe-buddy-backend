import { addNewAudioController } from "@/controllers/audioController";
import { isAuthUserController } from "@/controllers/userController";
import { isVerifiedUserMiddleware } from "@/middlewares/authMiddleware";
import { parseFileMiddleware } from "@/middlewares/fileParserMiddleware";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { AudioSchemaValidations } from "@/validations/audioModelValidations";
import { Router } from "express";

const audioRoutes = Router();

audioRoutes.post(
  "/add-new-audio",
  isAuthUserController,
  isVerifiedUserMiddleware,
  parseFileMiddleware,
  schemaValidatorMiddleware(AudioSchemaValidations),
  addNewAudioController
);

export default audioRoutes;
