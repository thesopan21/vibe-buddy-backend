import UserModel from "@/model/userModel";
import { Request, Response } from "express";

export const greetingController = (req: Request, res: Response) => {
  res.json({ message: "Hello user, We are in Production!" });
};

export const creatNewUserController = async (req, res) => {
  try {
    const { email, name, password } = req.body;

    // create and save new user inside db
    const newUser = await new UserModel({
      name,
      email,
      password,
    });

    return res.json({ newUser });
  } catch (error) {
    console.log("Error while creating new User!");
    return res.json({
      message: "Error while creating new user!",
    });
  }
};
