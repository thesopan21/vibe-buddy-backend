import {
  addNewAudioController,
  updateAudioController,
} from "@/controllers/audioController";
import {
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
} from "@/middlewares/authMiddleware";
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

audioRoutes.patch(
  "/update/:audioId",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  parseFileMiddleware,
  // schemaValidatorMiddleware(AudioSchemaValidations),
  updateAudioController
);

export default audioRoutes;
