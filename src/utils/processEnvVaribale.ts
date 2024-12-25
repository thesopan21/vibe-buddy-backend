import dotenv from "dotenv";

dotenv.config();

const processEnvironmentVariable = () => {
  return process.env;
};

const environmentVariable = processEnvironmentVariable();
export default environmentVariable;
