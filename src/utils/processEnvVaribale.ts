import dotenv from "dotenv";

dotenv.config();

// another way to export environment varibale
interface EnvironmentVarible {
  env: {
    [key: string]: string;
  };
}

const { env } = process as EnvironmentVarible;

export const {
  PORT,
  MONGO_DB_URI,
  MAILTRAP_USERNAME,
  MAILTRAP_PASSWORD,
  VERIFICATION_EMAIL_FROM,
  PASSWORD_RESET_URI,
  SIGN_IN_LINK,
  JWT_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_SECRET_KEY,
} = env;
