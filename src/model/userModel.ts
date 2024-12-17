import mongoose from "mongoose";

const connectToMongodb = async () => {
  try {
    const dbInstance = await mongoose.connect(
      "mongodb://127.0.0.1:27017/test_db"
    );
    console.log("Connection Established:");
  } catch (error) {
    console.log("Error While connecting to db");
  }
};


export default connectToMongodb;
