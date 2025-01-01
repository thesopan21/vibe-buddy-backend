import { RequestHandler } from "express";
import { object, ValidationError } from "yup";

export const schemaValidatorMiddleware = (schema: any): RequestHandler => {
  return async (req, res, next) => {
    if (!req.body) {
      res.status(422).json({
        error: "request body is empty!",
      });
    }

    // create object of given schema
    const schemaValidation = object({
      body : schema
    })

    try {
      // validate the req body by using above created object
      await schemaValidation.validate({
        body: req.body
      },{
        abortEarly: true
      });

      next();
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(422).json({
          error: error.message
        })
      }
    }
  };
};
