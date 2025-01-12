import { addNewAudioController } from "@/controllers/audioController";
import { isAuthUserController } from "@/controllers/userController";
import { parseFileMiddleware } from "@/middlewares/fileParserMiddleware";
import { schemaValidatorMiddleware } from "@/middlewares/schemaValidationMiddleware";
import { AudioSchemaValidations } from "@/validations/audioModelValidations";
import { Router } from "express";

const audioRoutes = Router();

audioRoutes.post(
  "/add-new-audio",
  isAuthUserController,
  
  parseFileMiddleware,
  schemaValidatorMiddleware(AudioSchemaValidations),
  addNewAudioController
);

export default audioRoutes;
