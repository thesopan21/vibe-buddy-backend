
import UserModel from "@/model/userModel";
import { CreateNewUserRequestBody } from "@/types/userTypes";
import { generateEmailVerificationToken } from "@/utils/generateVerificationToken";
import { Request, RequestHandler, Response } from "express";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

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

    // generate token for emial verification
    const otpToken = generateEmailVerificationToken();

    // send email for varification
    await sendVerificationEmail({
      email:newUser.email,
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
