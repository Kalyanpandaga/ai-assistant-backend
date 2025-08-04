import dotenv from "dotenv";
dotenv.config();
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const BASE_URL = process.env.BASE_URL;

if (!MONGO_URI) {
  console.error("MONGO_URI is not defined in environment variables");
  process.exit(1);
}

const allowedOrigin = process.env.FRONTEND_URL;
if (!allowedOrigin) {
  console.error("FRONTEND_URL is not defined in environment variables");
  process.exit(1);
}

export { MONGO_URI, PORT, allowedOrigin };
