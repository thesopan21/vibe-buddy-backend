import nodemailer from "nodemailer";
import {
  MAILTRAP_PASSWORD,
  MAILTRAP_USERNAME,
  VERIFICATION_EMAIL,
} from "./processEnvVaribale";
import { UserProfile } from "@/types/EmailVerificationTokenTypes";
import { generateTemplate } from "@/email/emailTemplate";
import path from "path";
import EmailVerificationTokenModel from "@/model/emailVerificationTokenModel";

export const sendVerificationEmail = async (userProfile: UserProfile) => {
  const { email, otpToken, userId, userName } = userProfile;

  // save token into db for verification purpose
  await EmailVerificationTokenModel.create({
    token: otpToken,
    woner: userId,
  });

  const transport = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USERNAME,
      pass: MAILTRAP_PASSWORD,
    },
  });

  transport.sendMail({
    to: email,
    from: "sbussiness21@gmail.com",
    subject: "Email Verification",
    html: generateTemplate({
      title: "Welcome to Vibe Buddy",
      userName: userName,
      banner: "cid:welcome",
      logo: "cid:logo",
      btnTitle: otpToken,
      link: "#",
    }),
    attachments: [
      {
        filename: "vibeBuddyLogo1.png",
        path: path.join(__dirname, "../assets/images/vibeBuddyLogo1.png"),
        cid: "logo",
      },
      {
        filename: "emailWelcomeBanner.png",
        path: path.join(__dirname, "../assets/images/emailWelcomeBanner.png"),
        cid: "welcome",
      },
    ],
  });
};
