import environmentVariable from "@/utils/processEnvVaribale";
import mongoose from "mongoose";

const DB_URL = environmentVariable.DB_URI || "mongodb://127.0.0.1:27017/test_db";

const connectToMongodb = async () => {
  try {
    const dbInstance = await mongoose.connect(DB_URL);
    console.log("Connection Established successfully!");
  } catch (error) {
    console.log("Error While connecting to db");
  }
};

export default connectToMongodb;