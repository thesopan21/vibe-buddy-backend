import dotenv from "dotenv";

dotenv.config();

// another way to export environment varibale
interface EnvironmentVarible {
  env: {
    [key: string]: string;
  };
}

const { env } = process as EnvironmentVarible;

export const MONGO_DB_URI = env.DB_URI;
export const PORT = env.PORT;

/**
const processEnvironmentVariable = () => {
  return process.env;
};

const environmentVariable = processEnvironmentVariable();
export default environmentVariable;
*/
