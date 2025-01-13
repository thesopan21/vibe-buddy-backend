import {
  addNewAudioController,
  updateAudioController,
} from "@/controllers/audioController";
import {
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
} from "@/middlewares/authMiddleware";
import { fileParseMiddleware } from "@/middlewares/fileParserMiddleware";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { AudioSchemaValidations } from "@/validations/audioModelValidations";
import { Router } from "express";

const audioRoutes = Router();

audioRoutes.post(
  "/create",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  fileParseMiddleware,
  // schemaValidatorMiddleware(AudioSchemaValidations),
  addNewAudioController
);

audioRoutes.patch(
  "/update/:audioId",
  isAuthorizedUserMiddleware,
  isVerifiedUserMiddleware,
  fileParseMiddleware,
  // schemaValidatorMiddleware(AudioSchemaValidations),
  updateAudioController
);

export default audioRoutes;
