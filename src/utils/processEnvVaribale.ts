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
  VERIFICATION_EMAIL,
  PASSWORD_RESET_URI,
} = env;
