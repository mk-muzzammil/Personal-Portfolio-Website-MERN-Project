import mongoose from "mongoose";
import { config } from "./config.js";

const dbconnection = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database connection established");
    });
    mongoose.connection.on("error", () => {
      console.log("Database connection failed Initially");
    });

    await mongoose.connect(config.MONGO_URI, {
      dbName: config.DB_NAME,
    });
  } catch (error) {
    console.log("Database connection failed", error);
  }
};

export default dbconnection;
