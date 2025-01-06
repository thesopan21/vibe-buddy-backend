import ResetPasswordModel from "@/model/resetPasswordModel";
import { NextFunction, Request, Response } from "express";

/**
 * Verify Reset Password Token and User ID Middleware
 *
 * This middleware function performs the following steps:
 * 1. Extracts `userId` and `token` from the request body.
 * 2. Finds the reset password token associated with the given `userId` in the database.
 * 3. Validates the existence of the token.
 * 4. Compares the provided token with the stored token using a secure comparison method.
 * 5. Sends an appropriate response based on the validation result.
 * 6. Handles errors and sends an error response if an exception occurs.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request containing the user ID and token.
 * @param {string} req.body.userId - The ID of the user to validate the reset password token for.
 * @param {string} req.body.token - The reset password token to be validated.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Promise<void>} - Sends a JSON response indicating the validation result or error.
 * @throws {Error} - Returns a JSON response with an error message and a status code if an error occurs.
 * @desc    Validates a reset password token to ensure it matches the one stored in the database for the user.
 *
 */
export const isValidUserAndTokenMiddleware = async (
  req: Request<{}, {}, { userId: string; token: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { token, userId } = req.body;

    // let find the token using userId
    const resetToken = await ResetPasswordModel.findOne({
      owner: userId,
    });

    if (!resetToken) {
      res.status(403).json({
        message: "Un-authorized, User not found!",
      });
      return;
    }

    // verify the token
    const isValidToken = await resetToken.compairePassword(token);

    if (!isValidToken) {
      res.status(403).json({
        message: "Unauthorized accesss, Invlid token",
      });
      return;
    }

    next();
  } catch (error) {
    console.log("Error while verifying Token:", error);
    res.status(500).json({
      message: "Internal server Error",
    });
  }
};
