import UserModel from "@/model/userModel";
import {
  CreateNewUserRequestBody,
  ValidateEmailRequestBody,
} from "@/types/userTypes";
import { generateEmailVerificationToken } from "@/utils/generateVerificationToken";
import { Request, RequestHandler, Response } from "express";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import EmailVerificationTokenModel from "@/model/emailVerificationTokenModel";

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
        message: "Internal server error try later!"
      })
      return
    }

    // generate token for emial verification
    const otpToken = generateEmailVerificationToken();

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
