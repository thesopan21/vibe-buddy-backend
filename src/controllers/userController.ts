import UserModel from "@/model/userModel";
import {
  CreateNewUserRequestBody,
  ReverificationTokenRequestBody,
  UpdatePasswordRequestBody,
  UserSignInRequestBody,
  ValidateEmailRequestBody,
} from "@/types/userTypes";
import {
  sendResetPasswordLinkEmail,
  sendUpdatePasswordSuccessMail,
  sendVerificationEmail,
} from "@/utils/sendEmail";
import { generateEmailVerificationToken } from "@/utils/generateVerificationToken";
import EmailVerificationTokenModel from "@/model/emailVerificationTokenModel";
import { ResetPasswordRequestBody } from "@/types/resetPasswordTypes";
import ResetPasswordModel from "@/model/resetPasswordModel";
import { JWT_SECRET, PASSWORD_RESET_URI } from "@/utils/processEnvVaribale";
import { isValidObjectId } from "mongoose";
import { randomBytes } from "crypto";
import jsonWebToken from "jsonwebtoken";
import { Request, RequestHandler, Response } from "express";

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

/**
 * Generate Forget Password URL and send it to the user's email.
 *
 * This function performs the following steps:
 * 1. Validates the provided `email`.
 * 2. Checks if the user exists in the database.
 * 3. Deletes any previously stored password reset tokens for the user.
 * 4. Generates a new password reset token.
 * 5. Stores the new token in the database.
 * 6. Constructs the password reset URL.
 * 7. Sends the reset URL to the user's email.
 * 8. Sends a success response or handles errors appropriately.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request containing the email.
 * @param {string} req.body.email - The email of the user to send the password reset URL to.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Promise<void>} - Returns a JSON response with the password reset URL if successful.
 * @throws {Error} - Returns a JSON response with an error message and a status code if an error occurs.
 * @desc    Generates a password reset URL and sends it to the user's email, ensuring secure token handling.
 * @route   POST: /api/v1/user/reset-password
 * @access  private
 */
export const generateForgetPasswordUrl = async (
  req: Request<{}, {}, ResetPasswordRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email } = req.body;

    // find user in db
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(403).json({
        message: "Account not found",
      });
      return;
    }

    // delete prev expire token if it is exist
    await ResetPasswordModel.findOneAndDelete({
      owner: user._id,
    });

    // generate random token
    const passwordToken = randomBytes(36).toString("hex");

    // save password token in db
    await ResetPasswordModel.create({
      owner: user?._id,
      token: passwordToken,
    });

    const passwordResetUrl = `${PASSWORD_RESET_URI}?token=${passwordToken}&userId:${user?._id}`;

    sendResetPasswordLinkEmail({
      email: user?.email,
      passwordResetUrl: passwordResetUrl,
      userName: user?.name,
    });

    res.status(200).json({
      message: "Password reset Link send on your email",
    });
  } catch (error) {
    console.log("Error while generatig password", error);
    res.status(500).json({
      message: "Internal servver error!",
    });
  }
};

/**
 * Reset Password
 *
 * This function handles resetting the user's password.
 *
 * Steps performed:
 * 1. Accepts a request to reset the password.
 * 2. Sends a response indicating that the password reset was successful.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Promise<void>} - Sends a JSON response indicating the password reset result.
 * @throws {Error} - Handles any unexpected errors during the process.
 * @desc    Completes the password reset process and confirms success to the client.
 * @route   POST: /api/v1/user/verify-reset-password-token
 * @access  private
 */
export const resetPassword = async (req: Request, res: Response) => {
  res.status(200).json({
    message: "Password reset successfully.",
    isPasswordReset: true,
  });
};

/**
 * Update the User Password
 *
 * This function allows a user to update their password securely.
 *
 * Steps performed:
 * 1. Validates the user by their `userId`.
 * 2. Ensures the new password is different from the existing password.
 * 3. Updates the user's password in the database.
 * 4. Deletes any associated reset password tokens.
 * 5. Sends a success email to notify the user of the password change.
 * 6. Sends an appropriate response to the client indicating success or failure.
 *
 * @param {Object} req - The request object from the client.
 * @param {Object} req.body - The body of the request containing the user ID and new password.
 * @param {string} req.body.password - The new password to be set.
 * @param {string} req.body.userId - The ID of the user updating their password.
 * @param {string} req.body.token.
 * @param {Object} res - The response object to send the response to the client.
 * @returns {Promise<void>} - Sends a JSON response indicating the result of the update.
 * @throws {Error} - Handles any unexpected errors during the process.
 * @desc    Updates a user's password and ensures secure handling of related tokens.
 * @route   POST: /api/v1/user/update-password
 * @access  private
 */
export const updatePassword = async (
  req: Request<{}, {}, UpdatePasswordRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { password, userId } = req.body;

    //find the user
    const user = await UserModel.findById(userId);
    if (!user) {
      res.status(403).json({
        message: "Unauthorized access!",
      });
      return;
    }

    const isValidPassword = await user.validatePassword(password);
    if (isValidPassword) {
      res.status(422).json({
        message: "The new password must be different!",
      });
      return;
    }

    user.password = password;
    await user.save();

    // delete stored token
    await ResetPasswordModel.findOneAndDelete({
      owner: user._id,
    });

    // send success email
    sendUpdatePasswordSuccessMail({
      email: user.email,
      userName: user.name,
    });

    res.status(200).json({
      message: "Password updated successfully!",
      success: true,
    });
  } catch (error) {}
};

/**
 * User Sign in Controller
 *
 * @param req
 * @param res
 */
export const userSignInController = async (
  req: Request<{}, {}, UserSignInRequestBody>,
  res: Response
): Promise<void> => {
  try {
    const { email, password } = req.body;

    // find the user inside the db
    const user = await UserModel.findOne({
      email,
    });

    if (!user) {
      res.status(403).json({
        message: "Invalid email!",
      });
      return;
    }

    // compaire the passoword
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      res.status(403).json({
        message: "Invalid Password",
      });
      return;
    }

    // generate the sign in token using jwt
    const token = jsonWebToken.sign({ userId: user._id }, JWT_SECRET);

    // update and save token inside the db
    user.tokens.push(token);
    await user.save();

    // send success message
    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        avatar: user.avatars?.url || "",
        followersCount: user.followers.length,
        followingsCount: user.followings.length,
      },
      authToken: token,
    });
  } catch (error) {
    console.log("Error while user sign in:", error);
    res.status(500).json({
      message: "Internal server error!",
    });
  }
};

export const isAuthUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    res.status(200).json({
      message: "User validate successfully!",
      isValidaUser: true,
    });
  } catch (error) {
    console.log("error while validating user");
    res.status(500).json({
      message: "User validation failed!",
    });
  }
};
