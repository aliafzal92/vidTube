import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

console.log(process.env.MONGODB_URI);

export const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGODB_URI}/${DB_NAME}`
    );
    console.log(
      `\nMongoDB connected successfully : Host: ${connectionInstance.connection.host}`
    );
    
  } catch (error) {
    console.error("Mongodb connection error: ", error);
    process.exit(1);
  }
};
