import { MONGO_DB_URI } from "@/utils/processEnvVaribale";
import mongoose from "mongoose";


const connectToMongodb = async () => {
  try {
    const dbInstance = await mongoose.connect(MONGO_DB_URI);
    console.log("Connection Established successfully!");
  } catch (error) {
    console.log("Error While connecting to db");
  }
};

export default connectToMongodb;