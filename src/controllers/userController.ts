import UserModel from "@/model/userModel";
import {
  CreateNewUserRequestBody,
  ReverificationTokenRequestBody,
  ValidateEmailRequestBody,
} from "@/types/userTypes";
import { generateEmailVerificationToken } from "@/utils/generateVerificationToken";
import { Request, RequestHandler, Response } from "express";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import EmailVerificationTokenModel from "@/model/emailVerificationTokenModel";
import { isValidObjectId } from "mongoose";

export const greetingController = (req: Request, res: Response) => {
  res.json({ message: "Hello user, We are in Production!" });
};

/**
 * Register a new user.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request containing the user data.
 * @param {string} req.body.username - The username of the new user.
 * @param {string} req.body.email - The email of the new user.
 * @param {string} req.body.password - The password of the new user.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Object} - Returns a JSON response with a success message and a token if the registration is successful.
 * @throws {Error} - Returns a JSON response with an error message and a status code if an error occurs.
 * @desc    Register a new user by creating a new user record in the database. If the user already exists, an error message is returned.
 * @route   POST: /api/v1/user/register
 * @access  Public
 */
export const creatNewUserController: RequestHandler = async (
  req: CreateNewUserRequestBody,
  res: any
) => {
  try {
    const { email, name, password } = req.body;

    // create and save new user inside db
    const newUser = await UserModel.create({
      name,
      email,
      password,
    });

    if (!newUser) {
      res.status(500).json({
        message: "Internal server error try later!",
      });
      return;
    }

    // generate token for emial verification
    const otpToken = generateEmailVerificationToken();

    // save token into db for verification purpose
    await EmailVerificationTokenModel.create({
      token: otpToken,
      owner: newUser._id,
    });

    // send email for varification
    await sendVerificationEmail({
      email: newUser.email,
      otpToken,
      userId: newUser._id.toString(),
      userName: newUser.name,
    });

    // send the api response
    return res.status(201).json({
      id: newUser._id,
      userName: newUser.name,
      email,
    });
  } catch (error) {
    console.log("Error while creating new User!", error);
    return res.status(500).json({
      message: "Error while creating new user!",
    });
  }
};

/**
 * Validate Email
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request containing the validation data.
 * @param {string} req.body.userId - The ID of the user attempting to validate their email.
 * @param {string} req.body.otpToken - The OTP token sent to the user's email for verification.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Promise<void>} - Returns a JSON response with a success message if validation is successful.
 * @throws {Error} - Returns a JSON response with an error message and a status code if an error occurs.
 * @desc    Validates the user's email using an OTP token sent to their email.
 * @route   POST: /api/v1/user/verify-email
 * @access  Public
 */
export const validateEmail = async (
  req: Request<{}, {}, ValidateEmailRequestBody>,
  res: Response<{}>
): Promise<void> => {
  try {
    const { userId, otpToken } = req.body;

    // Check if the user exists
    const isUserExists = await EmailVerificationTokenModel.findOne({
      owner: userId,
    });
    if (!isUserExists) {
      res.status(404).json({
        message: "User not found.",
      });
      return;
    }

    // Verify the OTP token
    const isTokenValid = await isUserExists.compareToken(otpToken);
    if (!isTokenValid) {
      res.status(400).json({
        message: "Invalid or expired OTP token.",
      });
      return;
    }

    // Mark the user's email as verified
    await UserModel.findByIdAndUpdate(userId, {
      isVerified: true,
    });

    // after verify delete otp token from email verification model/document
    await EmailVerificationTokenModel.findByIdAndDelete(isUserExists._id);

    // Send success response
    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.log("Error while validating OTP!", error);
    res.status(500).json({
      messge: "Internal server error!",
    });
  }
};

/**
 * Send Reverification Token to the user via email
 *
 * This function performs the following steps:
 * 1. Validates the provided `userId`.
 * 2. Checks if the user exists in the database.
 * 3. Deletes any previously stored verification tokens for the user.
 * 4. Generates a new email verification token.
 * 5. Stores the new token in the database.
 * 6. Sends the verification token to the user's email.
 * 7. Sends a success response or handles errors appropriately.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request containing the user ID.
 * @param {string} req.body.userId - The ID of the user to send the re-verification token to.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Promise<void>} - Returns a JSON response with a success message if the token is sent successfully.
 * @throws {Error} - Returns a JSON response with an error message and a status code if an error occurs.
 * @desc    Sends a re-verification token to the user's email and stores the token in the database.
 * @route   POST: /api/v1/user/reverification-token
 * @access  Public
 */
export const sendReverificationToken = async (
  req: Request<{}, {}, ReverificationTokenRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { userId } = req.body;

    // validate userId
    if (!isValidObjectId(userId)) {
      res.status(403).json({
        message: "Invalid user id !",
      });
      return;
    }

    // get user from db
    const user = await UserModel.findById(userId);

    // validated user is exist or not
    if (!user) {
      res.status(404).json({
        message: "USer not found",
      });
      return;
    }

    // delete previous stored token from db
    await EmailVerificationTokenModel.findOneAndDelete({
      owner: userId,
    });

    // generate new token
    const newOtpToken = generateEmailVerificationToken();

    // save newly generated otp into db
    await EmailVerificationTokenModel.create({
      owner: userId,
      token: newOtpToken,
    });

    // send otp to the user
    sendVerificationEmail({
      email: user?.email,
      userName: user?.name,
      userId: user?._id.toString(),
      otpToken: newOtpToken,
    });

    // send success response
    res.status(200).json({
      message: "OTP send successfully!",
    });
  } catch (error) {
    console.log("Error while sending reverification email", error);
    res.status(500).json({
      error: "Error while sending re-verification OTP.",
    });
  }
};
