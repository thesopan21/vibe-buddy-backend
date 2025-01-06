import { isValidObjectId } from "mongoose";
import { string, object } from "yup";

const nameValidation = string()
  .trim()
  .required("Name is Required!")
  .min(3, "Name must be grater than 3 character!")
  .max(16, "Name should not be larger than 16 character");

const emailValidation = string()
  .required("Email is Required!")
  .email("Invalid email id!");

const passwordValidation = string()
  .trim()
  .required("Password is required!")
  .min(6, "Password length must be 6!")
  .matches(
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[a-zA-Z\d!@#\$%\^&\*]+$/,
    "Password is to weak!"
  );

const otpTokenValidation = string()
  .trim()
  .required("OTP required!")
  .min(6, "OTP length must be 6 digit only!")
  .max(6, "OTP length must be 6 digit only!");

const tokenValidation = string().trim().required("Token is required!");

const userIdValidation = string()
  .transform(function (userId) {
    if (this.isType(userId) && isValidObjectId(userId)) {
      return userId;
    }
    return "";
  })
  .trim()
  .required("User id is required!");

export const CreateNewUserRequestBodyValidation = object().shape({
  name: nameValidation,
  email: emailValidation,
  password: passwordValidation,
});

export const EmailVerifiactionRequestBodyValidation = object().shape({
  otpToken: otpTokenValidation,
  userId: userIdValidation,
});

export const ResetPasswordRequestBodyValidations = object().shape({
  userId: userIdValidation,
  token: tokenValidation,
});

export const UpdatePasswordRequestBodyValidation = object().shape({
  userId: userIdValidation,
  token: tokenValidation,
  password: passwordValidation
})