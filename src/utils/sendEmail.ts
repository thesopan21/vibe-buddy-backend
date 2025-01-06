import nodemailer from "nodemailer";
import {
  MAILTRAP_PASSWORD,
  MAILTRAP_USERNAME,
  SIGN_IN_LINK,
  VERIFICATION_EMAIL_FROM,
} from "./processEnvVaribale";
import {
  ResetPasswordOptions,
  UpdatePasswordUserProfile,
  UserProfile,
} from "@/types/EmailVerificationTokenTypes";
import { generateTemplate } from "@/email/emailTemplate";
import path from "path";

const createEmailTransportor = () => {
  const emailTransportor = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: MAILTRAP_USERNAME,
      pass: MAILTRAP_PASSWORD,
    },
  });
  return emailTransportor;
};

export const sendVerificationEmail = async (userProfile: UserProfile) => {
  const { email, otpToken, userId, userName } = userProfile;

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

export const sendResetPasswordLinkEmail = async (
  userProfile: ResetPasswordOptions
) => {
  const { email, passwordResetUrl, userName } = userProfile;

  const message =
    "We just received a request that you forget your passwrod. no problem you can use the below link below to create a new brand password.";

  const transport = createEmailTransportor();

  transport.sendMail({
    to: email,
    from: VERIFICATION_EMAIL_FROM,
    subject: "Reset Password",
    html: generateTemplate({
      title: "Forget Password",
      userName: userName,
      banner: "cid:forgotPasswordBanner",
      logo: "cid:logo",
      btnTitle: "Reset Password",
      link: passwordResetUrl,
      msg: message,
    }),
    attachments: [
      {
        filename: "vibeBuddyLogo1.png",
        path: path.join(__dirname, "../assets/images/vibeBuddyLogo1.png"),
        cid: "logo",
      },
      {
        filename: "forgotPasswordBanner.png",
        path: path.join(__dirname, "../assets/images/forgotPasswordBanner.png"),
        cid: "forgotPasswordBanner",
      },
    ],
  });
};

export const sendUpdatePasswordSuccessMail = async (
  userProfile: UpdatePasswordUserProfile
) => {
  const { email, userName } = userProfile;
  const mailTransportor = createEmailTransportor();
  const message = `Dear ${userName} we just updatd your new password. You can  now sign in with you new password.`;

  mailTransportor.sendMail({
    to: email,
    from: VERIFICATION_EMAIL_FROM,
    subject: "Password update success",
    html: generateTemplate({
      title: "Password update Successfully!",
      userName,
      banner: "cid:forgotPasswordBanner",
      logo: "cid:vibeBuddyLogo1",
      btnTitle: "Sign In",
      link: SIGN_IN_LINK,
      msg: message
    }),
    attachments: [
      {
        filename: "vibeBuddyLogo1.png",
        path: path.join(__dirname, "../assets/images/vibeBuddyLogo1.png"),
        cid: "logo",
      },
      {
        filename: "forgotPasswordBanner.png",
        path: path.join(__dirname, "../assets/images/forgotPasswordBanner.png"),
        cid: "forgotPasswordBanner",
      },
    ],
  });
};
