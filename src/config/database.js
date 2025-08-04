import mongoose from "mongoose";
import { MONGO_URI } from "./constants.js";

const connectDB = async () => {
  await mongoose.connect(MONGO_URI);
};

export default connectDB;
