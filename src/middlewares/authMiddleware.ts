import ResetPasswordModel from "@/model/resetPasswordModel";
import UserModel from "@/model/userModel";
import { JWT_SECRET } from "@/utils/processEnvVaribale";
import { NextFunction, Request, RequestHandler, Response } from "express";
import { JwtPayload, verify } from "jsonwebtoken";

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

/**
 * Authorization Middleware for Validating User and Token
 *
 * This middleware function performs the following steps:
 * 1. Extracts the `authorization` header from the request.
 * 2. Ensures the presence of the `Bearer` token in the `authorization` header.
 * 3. Decodes and verifies the JWT using a secret key to extract the payload.
 * 4. Validates the presence of the `userId` in the JWT payload.
 * 5. Searches the database for a user with the specified `userId` and token.
 * 6. Sends an appropriate response if any validation step fails.
 * 7. Proceeds to the next middleware if the user and token are valid.
 * 8. Handles errors and sends an error response if an exception occurs.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.headers - The headers of the request, including the `authorization` header.
 * @param {Object} res - The response object to send the response to the client.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} - Proceeds to the next middleware if the user and token are valid, otherwise sends an error response.
 * @throws {Error} - Returns a JSON response with an error message and a status code if an error occurs during validation.
 * @desc    Ensures that the user is authorized by validating the JWT token and the user's existence in the database.
 */
export const isAuthorizedUserMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      res.status(404).json({
        message: "Token not found!",
      });
      return;
    }

    const userToken = authorization.split(" ")[1];

    if (!userToken) {
      res.status(404).json({
        message: "Token not found!",
      });
      return;
    }

    const jwtPayload = verify(userToken, JWT_SECRET) as JwtPayload;
    const userId = jwtPayload.userId;
    
    if (!userId) {
      res.status(404).json({
        message: "Invalid jwt payload!",
      });
      return;
    }

    const user = await UserModel.findOne({
      _id: userId,
      tokens: userToken,
    });

    if (!user) {
      res.status(404).json({
        message: "User not found!",
      });
      return;
    }

    console.log(user)

    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      isVerified: user.isVerified,
      avatar: user.avatars?.url || "",
      followersCount: user.followers.length,
      followingsCount: user.followings.length,
    };

    next();
  } catch (error) {
    console.log("Error while authorizing user!", error);
    res.status(500).json({
      message: "Internal server Error!",
    });
  }
};
