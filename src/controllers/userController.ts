import EmailVerificationTokenModel from "@/model/emailVerificationTokenModel";
import UserModel from "@/model/userModel";
import { CreateNewUserRequestBody } from "@/types/userTypes";
import { generateEmailVerificationToken } from "@/utils/generateVerificationToken";
import {
  MAILTRAP_PASSWORD,
  MAILTRAP_USERNAME,
} from "@/utils/processEnvVaribale";
import { Request, RequestHandler, Response } from "express";
import nodemailer from "nodemailer";

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
    const newUser = await new UserModel({
      name,
      email,
      password,
    });

    // send email for varification
    const transport = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: MAILTRAP_USERNAME,
        pass: MAILTRAP_PASSWORD,
      },
    });

    // generate token for emial verification
    const otpToken = generateEmailVerificationToken();

    // save token into db for verification purpose
    await EmailVerificationTokenModel.create({
      token: otpToken,
      woner: newUser._id,
    });

    transport.sendMail({
      to: newUser.email,
      from: "sbussiness21@gmail.com",
      html: `
      <h1>Your verification OTP is ${otpToken}.</h1>
      <h5>Do not share your otp with unknown!</h5>
      `,
    });

    return res.status(201).json({ newUser });
  } catch (error) {
    console.log("Error while creating new User!", error);
    return res.status(500).json({
      message: "Error while creating new user!",
    });
  }
};
